import z from 'zod';
import { subMonths } from 'date-fns';

import { baseQuerySchema } from '../lib';
import { ethereumAddressSchema } from '@/lib/schemas';
import { createCachedArrayQuery, createStandardCacheKey } from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';

export const bucketedStatisticsInputSchema = baseQuerySchema.extend({
  addresses: z.array(ethereumAddressSchema).optional(),
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

const getBucketedStatisticsUncached = async (
  input: z.input<typeof bucketedStatisticsInputSchema>
) => {
  const parseResult = bucketedStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { addresses, startDate, endDate, numBuckets, facilitators, tokens } =
    parseResult.data;

  // Build the where clause for Prisma
  const where = {
    // Filter by token addresses
    address: { in: tokens.map(t => t.toLowerCase()) },
    // Filter by facilitator addresses
    transaction_from: { in: facilitators.map(f => f.toLowerCase()) },
    // Optional filter by recipient addresses (sellers)
    ...(addresses && addresses.length > 0 && {
      recipient: { in: addresses.map(a => a.toLowerCase()) },
    }),
    // Date range filters
    block_timestamp: { gte: startDate, lte: endDate },
    // NOTE(shafu): There is one big 45k transfer that destroys the chart, so we filter it out.
    amount: { lt: 1000000000 },
  };

  // Get all transfers in the time range
  const transfers = await transfersPrisma.transferEvent.findMany({
    where,
    select: {
      block_timestamp: true,
      amount: true,
      sender: true,
      recipient: true,
    },
  });

  // Calculate bucket size in seconds for consistent alignment
  const timeRangeMs = endDate.getTime() - startDate.getTime();
  const bucketSizeMs = Math.floor(timeRangeMs / numBuckets);
  const bucketSizeSeconds = Math.max(1, Math.floor(bucketSizeMs / 1000));

  // Calculate the first bucket start time aligned to the bucket size
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const firstBucketStartTimestamp =
    Math.floor(startTimestamp / bucketSizeSeconds) * bucketSizeSeconds;

  // Group transfers into buckets
  const bucketMap = new Map<number, {
    total_transactions: number;
    total_amount: number;
    buyers: Set<string>;
    sellers: Set<string>;
  }>();

  for (const transfer of transfers) {
    const timestamp = Math.floor(transfer.block_timestamp.getTime() / 1000);
    const bucketIndex = Math.floor((timestamp - firstBucketStartTimestamp) / bucketSizeSeconds);
    const bucketStartTimestamp = firstBucketStartTimestamp + bucketIndex * bucketSizeSeconds;

    if (!bucketMap.has(bucketStartTimestamp)) {
      bucketMap.set(bucketStartTimestamp, {
        total_transactions: 0,
        total_amount: 0,
        buyers: new Set(),
        sellers: new Set(),
      });
    }

    const bucket = bucketMap.get(bucketStartTimestamp)!;
    bucket.total_transactions++;
    bucket.total_amount += transfer.amount;
    bucket.buyers.add(transfer.sender);
    bucket.sellers.add(transfer.recipient);
  }

  // Generate complete time series with zero values for missing periods
  const completeTimeSeries = [];

  // Generate all expected time buckets
  for (let i = 0; i < numBuckets; i++) {
    const bucketStartTimestamp = firstBucketStartTimestamp + i * bucketSizeSeconds;
    const bucketStart = new Date(bucketStartTimestamp * 1000);
    const bucket = bucketMap.get(bucketStartTimestamp);

    completeTimeSeries.push({
      bucket_start: bucketStart,
      total_transactions: bucket?.total_transactions ?? 0,
      total_amount: bucket?.total_amount ?? 0,
      unique_buyers: bucket?.buyers.size ?? 0,
      unique_sellers: bucket?.sellers.size ?? 0,
    });
  }

  return completeTimeSeries;
};

export const getBucketedStatistics = createCachedArrayQuery({
  queryFn: getBucketedStatisticsUncached,
  cacheKeyPrefix: 'bucketed-statistics',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['bucket_start'],

  tags: ['statistics'],
});
