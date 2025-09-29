import z from 'zod';

import { runBaseSqlQuery } from './query';
import { ethereumAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';

import type { infiniteQuerySchema } from '@/lib/pagination';
import { formatDateForSql } from './lib';

export const listTopSellersInputSchema = z.object({
  sorting: z
    .array(
      z.object({
        id: z.enum([
          'tx_count',
          'total_amount',
          'latest_block_timestamp',
          'unique_buyers',
        ]),
        desc: z.boolean(),
      })
    )
    .default([{ id: 'total_amount', desc: true }]),
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const listTopSellers = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const parseResult = listTopSellersInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { sorting, addresses, startDate, endDate } = parseResult.data;
  const { limit } = pagination;
  const outputSchema = z.array(
    z.object({
      recipient: ethereumAddressSchema,
      tx_count: z.coerce.bigint(),
      total_amount: z.coerce.bigint(),
      latest_block_timestamp: z.coerce.date(),
      unique_buyers: z.coerce.bigint(),
    })
  );

  const sql = `SELECT 
    parameters['to']::String AS recipient, 
    COUNT(*) AS tx_count, 
    SUM(parameters['value']::UInt256) AS total_amount,
    max(block_timestamp) AS latest_block_timestamp,
    COUNT(DISTINCT parameters['from']::String) AS unique_buyers
FROM base.events 
WHERE event_signature = 'Transfer(address,address,uint256)'
    AND address = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
    AND transaction_from IN (
        '0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', 
        '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'
    )
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
ORDER BY ${sorting.map(s => `${s.id} ${s.desc ? 'DESC' : 'ASC'}`).join(', ')} 
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
