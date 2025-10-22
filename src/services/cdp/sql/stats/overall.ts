import z from 'zod';
import { Prisma } from '@prisma/client';

import { ethereumAddressSchema } from '@/lib/schemas';
import { baseQuerySchema, applyBaseQueryDefaults } from '../lib';
import { createCachedQuery, createStandardCacheKey } from '@/lib/cache';
import { queryRaw } from '@/services/db/transfers-client';
import { normalizeAddresses } from '@/lib/utils';

export const overallStatisticsInputSchema = baseQuerySchema.extend({
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const overallStatisticsResultSchema = z.array(
  z.object({
    total_transactions: z.number(),
    total_amount: z.number(),
    unique_buyers: z.number(),
    unique_sellers: z.number(),
    latest_block_timestamp: z.date().nullable(),
  })
);

const getOverallStatisticsUncached = async (
  input: z.input<typeof overallStatisticsInputSchema>
) => {
  const parseResult = overallStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const { addresses, startDate, endDate, facilitators, tokens, chain } = parsed;

  const normalizedTokens = normalizeAddresses(tokens, chain);
  const normalizedFacilitators = normalizeAddresses(facilitators, chain);
  const normalizedAddresses = addresses && normalizeAddresses(addresses, chain);

  const recipientFilter =
    normalizedAddresses && normalizedAddresses.length > 0
      ? Prisma.sql`AND t.recipient = ANY(${normalizedAddresses}::text[])`
      : Prisma.empty;

  const dateFilter =
    startDate && endDate
      ? Prisma.sql`AND t.block_timestamp >= ${startDate} AND t.block_timestamp <= ${endDate}`
      : startDate
        ? Prisma.sql`AND t.block_timestamp >= ${startDate}`
        : endDate
          ? Prisma.sql`AND t.block_timestamp <= ${endDate}`
          : Prisma.empty;

  const sql = Prisma.sql`
    SELECT 
      COUNT(*)::int AS total_transactions,
      COALESCE(SUM(t.amount), 0)::float AS total_amount,
      COUNT(DISTINCT t.sender)::int AS unique_buyers,
      COUNT(DISTINCT t.recipient)::int AS unique_sellers,
      MAX(t.block_timestamp) AS latest_block_timestamp
    FROM "TransferEvent" t
    WHERE t.chain = ${chain}
      AND t.address = ANY(${normalizedTokens}::text[])
      AND t.transaction_from = ANY(${normalizedFacilitators}::text[])
      ${recipientFilter}
      ${dateFilter}
  `;

  const result = await queryRaw(sql, overallStatisticsResultSchema);

  const {
    total_transactions = 0,
    total_amount = 0,
    unique_buyers = 0,
    unique_sellers = 0,
    latest_block_timestamp = new Date(),
  } = result[0] ?? {};

  return {
    total_transactions,
    total_amount: Number(total_amount),
    unique_buyers,
    unique_sellers,
    latest_block_timestamp,
  };
};

export const getOverallStatistics = createCachedQuery({
  queryFn: getOverallStatisticsUncached,
  cacheKeyPrefix: 'overall-statistics',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['latest_block_timestamp'],

  tags: ['statistics'],
});
