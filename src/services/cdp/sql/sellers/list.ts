import { unstable_cache } from 'next/cache';
import z from 'zod';

import { runBaseSqlQuery } from '../query';
import { ethereumAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';

import type { infiniteQuerySchema } from '@/lib/pagination';
import { baseQuerySchema, formatDateForSql, sortingSchema } from '../lib';

const sellerSortIds = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
] as const;

export type SellerSortId = (typeof sellerSortIds)[number];

export const listTopSellersInputSchema = baseQuerySchema.extend({
  sorting: sortingSchema(sellerSortIds),
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const listTopSellersUncached = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const parseResult = listTopSellersInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { sorting, addresses, startDate, endDate, facilitators, tokens } =
    parseResult.data;
  const { limit } = pagination;
  const outputSchema = z.array(
    z.object({
      recipient: ethereumAddressSchema,
      facilitators: z.array(ethereumAddressSchema),
      tx_count: z.coerce.number(),
      total_amount: z.coerce.number(),
      latest_block_timestamp: z.coerce.date(),
      unique_buyers: z.coerce.number(),
    })
  );

  const sql = `SELECT 
    parameters['to']::String AS recipient, 
    COUNT(*) AS tx_count, 
    SUM(parameters['value']::UInt256) AS total_amount,
    max(block_timestamp) AS latest_block_timestamp,
    COUNT(DISTINCT parameters['from']::String) AS unique_buyers,
    groupArray(DISTINCT transaction_from) AS facilitators
FROM base.events 
WHERE event_signature = 'Transfer(address,address,uint256)'
    AND address IN (${tokens.map(t => `'${t}'`).join(', ')})
    AND transaction_from IN (${facilitators.map(f => `'${f}'`).join(', ')})
    ${
      addresses
        ? `AND recipient IN (${addresses.map(a => `'${a}'`).join(', ')})`
        : ''
    }
    ${
      startDate ? `AND block_timestamp >= '${formatDateForSql(startDate)}'` : ''
    }
    ${endDate ? `AND block_timestamp <= '${formatDateForSql(endDate)}'` : ''}
GROUP BY recipient 
ORDER BY ${sorting.id} ${sorting.desc ? 'DESC' : 'ASC'}
LIMIT ${limit + 1};
  `;

  const items = await runBaseSqlQuery(sql, outputSchema);
  if (!items) {
    return toPaginatedResponse({
      items: [],
      limit,
    });
  }
  return toPaginatedResponse({
    items,
    limit,
  });
};

const createCacheKey = (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const parsed = listTopSellersInputSchema.parse(input);

  // Round dates to nearest minute for stable cache keys
  const roundDate = (date?: Date) => {
    if (!date) return undefined;
    const rounded = new Date(date);
    rounded.setSeconds(0, 0);
    return rounded.toISOString();
  };

  return JSON.stringify({
    sorting: parsed.sorting,
    addresses: parsed.addresses?.sort(),
    startDate: roundDate(parsed.startDate),
    endDate: roundDate(parsed.endDate),
    facilitators: parsed.facilitators.sort(),
    tokens: parsed.tokens.sort(),
    limit: pagination.limit,
  });
};

export const listTopSellers = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const cacheKey = createCacheKey(input, pagination);

  const result = await unstable_cache(
    async () => {
      const data = await listTopSellersUncached(input, pagination);

      // Convert dates to ISO strings for JSON serialization
      return {
        ...data,
        items: data.items.map(item => ({
          ...item,
          latest_block_timestamp: item.latest_block_timestamp.toISOString(),
        })),
      };
    },
    ['sellers-list', cacheKey],
    {
      revalidate: 60,
      tags: ['sellers'],
    }
  )();

  // Convert ISO strings back to Date objects
  return {
    ...result,
    items: result.items.map(item => ({
      ...item,
      latest_block_timestamp: new Date(item.latest_block_timestamp),
    })),
  };
};
