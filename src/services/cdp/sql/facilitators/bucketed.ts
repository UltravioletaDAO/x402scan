import z from 'zod';
import { subMonths } from 'date-fns';

import { baseQuerySchema, applyBaseQueryDefaults } from '../lib';
import { createCachedArrayQuery, createStandardCacheKey } from '@/lib/cache';
import { facilitators } from '@/lib/facilitators';
import { transfersPrisma } from '@/services/db/transfers-client';
import { normalizeAddresses } from '@/lib/utils';

export const bucketedStatisticsInputSchema = baseQuerySchema.extend({
  startDate: z
    .date()
    .optional()
    .default(() => subMonths(new Date(), 1)),
  endDate: z
    .date()
    .optional()
    .default(() => new Date()),
  numBuckets: z.number().optional().default(48),
});

const getBucketedFacilitatorsStatisticsUncached = async (
  input: z.input<typeof bucketedStatisticsInputSchema>
) => {
  const parseResult = bucketedStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const { startDate, endDate, numBuckets, tokens, chain } = parsed;

  const chainFacilitators = facilitators.filter(f => f.chain === chain);

  // Build the where clause for Prisma
  const where = {
    // Filter by chain
    chain: chain,
    // Filter by token addresses
    address: { in: normalizeAddresses(tokens, chain) },
    // Filter by known facilitator addresses
    transaction_from: { 
      in: normalizeAddresses(
        chainFacilitators.flatMap(f => f.addresses),
        chain
      )
    },
    // Date range filters
    block_timestamp: { gte: startDate, lte: endDate },
  };

  // Get all transfers in the time range
  const transfers = await transfersPrisma.transferEvent.findMany({
    where,
    select: {
      block_timestamp: true,
      amount: true,
      sender: true,
      recipient: true,
      transaction_from: true,
    },
  });

  // Calculate bucket size in seconds for consistent alignment
  const timeRangeMs = endDate.getTime() - startDate.getTime();
  const bucketSizeMs = Math.floor(timeRangeMs / numBuckets);
  const bucketSizeSeconds = Math.max(1, Math.floor(bucketSizeMs / 1000));
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const firstBucketStartTimestamp = Math.floor(startTimestamp / bucketSizeSeconds) * bucketSizeSeconds;

  // Group transfers into buckets by facilitator
  type FacilitatorStats = {
    total_transactions: number;
    total_amount: number;
    buyers: Set<string>;
    sellers: Set<string>;
  };
  const bucketMap = new Map<number, Map<string, FacilitatorStats>>();

  for (const transfer of transfers) {
    const timestamp = Math.floor(transfer.block_timestamp.getTime() / 1000);
    const bucketIndex = Math.floor((timestamp - firstBucketStartTimestamp) / bucketSizeSeconds);
    const bucketStartTimestamp = firstBucketStartTimestamp + bucketIndex * bucketSizeSeconds;

    if (!bucketMap.has(bucketStartTimestamp)) {
      bucketMap.set(bucketStartTimestamp, new Map());
    }

    const facilitatorMap = bucketMap.get(bucketStartTimestamp)!;
    
    // Map address to facilitator name
    const facilitator = facilitators.find(f => 
      f.addresses.some(addr => addr.toLowerCase() === transfer.transaction_from.toLowerCase())
    );
    const facilitatorName = facilitator?.name ?? 'Unknown';

    if (!facilitatorMap.has(facilitatorName)) {
      facilitatorMap.set(facilitatorName, {
        total_transactions: 0,
        total_amount: 0,
        buyers: new Set(),
        sellers: new Set(),
      });
    }

    const facilitatorStats = facilitatorMap.get(facilitatorName)!;
    facilitatorStats.total_transactions++;
    facilitatorStats.total_amount += transfer.amount;
    facilitatorStats.buyers.add(transfer.sender);
    facilitatorStats.sellers.add(transfer.recipient);
  }

  // Generate complete time series
  const result = [];
  for (let i = 0; i < numBuckets; i++) {
    const bucketStartTimestamp = firstBucketStartTimestamp + i * bucketSizeSeconds;
    const bucketStart = new Date(bucketStartTimestamp * 1000);
    const facilitatorMap = bucketMap.get(bucketStartTimestamp) ?? new Map<string, FacilitatorStats>();

    const facilitatorsByName: Record<string, {
      total_transactions: number;
      total_amount: number;
      unique_buyers: number;
      unique_sellers: number;
    }> = {};

    for (const [facilitatorName, stats] of facilitatorMap.entries()) {
      facilitatorsByName[facilitatorName] = {
        total_transactions: stats.total_transactions,
        total_amount: stats.total_amount,
        unique_buyers: stats.buyers.size,
        unique_sellers: stats.sellers.size,
      };
    }

    result.push({
      bucket_start: bucketStart,
      facilitators: facilitatorsByName,
    });
  }

  return result;
};

export const getBucketedFacilitatorsStatistics = createCachedArrayQuery({
  queryFn: getBucketedFacilitatorsStatisticsUncached,
  cacheKeyPrefix: 'bucketed-facilitators-statistics',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['bucket_start'],

  tags: ['facilitators-statistics'],
});
