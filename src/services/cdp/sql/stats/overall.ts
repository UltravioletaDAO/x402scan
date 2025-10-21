import z from 'zod';

import { ethereumAddressSchema } from '@/lib/schemas';
import { baseQuerySchema } from '../lib';
import { createCachedQuery, createStandardCacheKey } from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';

export const overallStatisticsInputSchema = baseQuerySchema.extend({
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const getOverallStatisticsUncached = async (
  input: z.input<typeof overallStatisticsInputSchema>
) => {
  const parseResult = overallStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { addresses, startDate, endDate, facilitators, tokens, chain } =
    parseResult.data;

  // Build the where clause for Prisma
  const where = {
    // Filter by chain
    chain: chain,
    // Filter by token addresses
    address: { in: tokens.map(t => t.toLowerCase()) },
    // Filter by facilitator addresses
    transaction_from: { in: facilitators.map(f => f.toLowerCase()) },
    // Optional filter by recipient addresses (sellers)
    ...(addresses && addresses.length > 0 && {
      recipient: { in: addresses.map(a => a.toLowerCase()) },
    }),
    // Date range filters
    ...(startDate && endDate && {
      block_timestamp: { gte: startDate, lte: endDate },
    }),
    ...(startDate && !endDate && {
      block_timestamp: { gte: startDate },
    }),
    ...(!startDate && endDate && {
      block_timestamp: { lte: endDate },
    }),
  };

  // Get aggregated data
  const [count, aggregates, latestTransfer, uniqueBuyers, uniqueSellers] = await Promise.all([
    // Total transactions count
    transfersPrisma.transferEvent.count({ where }),
    
    // Total amount sum
    transfersPrisma.transferEvent.aggregate({
      where,
      _sum: { amount: true },
    }),
    
    // Latest transfer timestamp
    transfersPrisma.transferEvent.findFirst({
      where,
      orderBy: { block_timestamp: 'desc' },
      select: { block_timestamp: true },
    }),
    
    // Unique buyers (distinct senders)
    transfersPrisma.transferEvent.groupBy({
      by: ['sender'],
      where,
    }),
    
    // Unique sellers (distinct recipients)
    transfersPrisma.transferEvent.groupBy({
      by: ['recipient'],
      where,
    }),
  ]);

  return {
    total_transactions: count,
    total_amount: aggregates._sum.amount ?? 0,
    unique_buyers: uniqueBuyers.length,
    unique_sellers: uniqueSellers.length,
    latest_block_timestamp: latestTransfer?.block_timestamp ?? new Date(),
  };
};

export const getOverallStatistics = createCachedQuery({
  queryFn: getOverallStatisticsUncached,
  cacheKeyPrefix: 'overall-statistics',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['latest_block_timestamp'],

  tags: ['statistics'],
});
