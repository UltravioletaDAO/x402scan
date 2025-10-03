import { unstable_cache } from 'next/cache';
import z from 'zod';

import { runBaseSqlQuery } from '../query';

import { ethereumAddressSchema, ethereumHashSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';
import { baseQuerySchema, formatDateForSql, sortingSchema } from '../lib';

const listFacilitatorTransfersSortIds = ['block_timestamp', 'amount'] as const;

export type TransfersSortId = (typeof listFacilitatorTransfersSortIds)[number];

export const listFacilitatorTransfersInputSchema = baseQuerySchema.extend({
  recipient: ethereumAddressSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: sortingSchema(listFacilitatorTransfersSortIds).default({
    id: 'block_timestamp',
    desc: true,
  }),
});

const outputSchema = z.array(
  z.object({
    sender: ethereumAddressSchema,
    recipient: ethereumAddressSchema,
    amount: z.coerce.number(),
    token_address: ethereumAddressSchema,
    transaction_from: ethereumAddressSchema,
    transaction_hash: ethereumHashSchema,
    block_timestamp: z.coerce.date(),
    log_index: z.number(),
  })
);

const listFacilitatorTransfersUncached = async (
  input: z.input<typeof listFacilitatorTransfersInputSchema>
) => {
  const parseResult = listFacilitatorTransfersInputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error('invalid input', input);
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const {
    recipient,
    startDate,
    endDate,
    limit,
    facilitators,
    tokens,
    sorting,
  } = parseResult.data;

  const sql = `SELECT
  parameters['from']::String AS sender,
  parameters['to']::String AS recipient,
  parameters['value']::UInt256 AS amount,
  transaction_from,
  address AS token_address,
  transaction_hash,
  block_timestamp,
  log_index
FROM base.events
WHERE event_signature = 'Transfer(address,address,uint256)'
  AND transaction_from IN (${facilitators.map(f => `'${f}'`).join(', ')})
  AND address IN (${tokens.map(t => `'${t}'`).join(', ')})
  ${recipient ? `AND recipient = '${recipient}'` : ''}
  ${startDate ? `AND block_timestamp > '${formatDateForSql(startDate)}'` : ''}
  ${endDate ? `AND block_timestamp < '${formatDateForSql(endDate)}'` : ''}
ORDER BY ${sorting.id} ${sorting.desc ? 'DESC' : 'ASC'}
LIMIT ${limit + 1};`;
  const result = await runBaseSqlQuery(sql, outputSchema);

  return toPaginatedResponse({
    items: result ?? [],
    limit,
  });
};

const createCacheKey = (
  input: z.input<typeof listFacilitatorTransfersInputSchema>
) => {
  const parsed = listFacilitatorTransfersInputSchema.parse(input);

  // Round dates to nearest minute for stable cache keys
  const roundDate = (date?: Date) => {
    if (!date) return undefined;
    const rounded = new Date(date);
    rounded.setSeconds(0, 0);
    return rounded.toISOString();
  };

  return JSON.stringify({
    recipient: parsed.recipient,
    startDate: roundDate(parsed.startDate),
    endDate: roundDate(parsed.endDate),
    limit: parsed.limit,
    facilitators: parsed.facilitators.sort(),
    tokens: parsed.tokens.sort(),
    sorting: parsed.sorting,
  });
};

export const listFacilitatorTransfers = async (
  input: z.input<typeof listFacilitatorTransfersInputSchema>
) => {
  const cacheKey = createCacheKey(input);

  const result = await unstable_cache(
    async () => {
      const data = await listFacilitatorTransfersUncached(input);

      // Convert dates to ISO strings for JSON serialization
      return {
        ...data,
        items: data.items.map(item => ({
          ...item,
          block_timestamp: item.block_timestamp.toISOString(),
        })),
      };
    },
    ['transfers-list', cacheKey],
    {
      revalidate: 60,
      tags: ['transfers'],
    }
  )();

  // Convert ISO strings back to Date objects
  return {
    ...result,
    items: result.items.map(item => ({
      ...item,
      block_timestamp: new Date(item.block_timestamp),
    })),
  };
};
