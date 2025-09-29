import {
  getFirstTransferTimestampInputSchema,
  getFirstTransferTimestamp,
  getOverallStatistics,
  overallStatisticsInputSchema,
} from '@/services/cdp/sql/overall-statistics';
import {
  getBucketedStatistics,
  bucketedStatisticsInputSchema,
} from '@/services/cdp/sql/bucketed-statistics';

import { createTRPCRouter, publicProcedure } from '../trpc';
import { getAcceptsAddresses } from '@/services/db/accepts';

export const statisticsRouter = createTRPCRouter({
  getOverallStatistics: publicProcedure
    .input(overallStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getOverallStatistics(input);
    }),
  getBazaarOverallStatistics: publicProcedure
    .input(overallStatisticsInputSchema)
    .query(async ({ input }) => {
      const originsByAddress = await getAcceptsAddresses();
      return await getOverallStatistics({
        ...input,
        addresses: Object.keys(originsByAddress),
      });
    }),
  getBucketedStatistics: publicProcedure
    .input(bucketedStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getBucketedStatistics(input);
    }),

  getFirstTransferTimestamp: publicProcedure
    .input(getFirstTransferTimestampInputSchema)
    .query(async ({ input }) => {
      return await getFirstTransferTimestamp(input);
    }),

  bazaar: {
    overallStatistics: publicProcedure
      .input(overallStatisticsInputSchema)
      .query(async ({ input }) => {
        const originsByAddress = await getAcceptsAddresses();
        return await getOverallStatistics({
          ...input,
          addresses: Object.keys(originsByAddress),
        });
      }),
    bucketedStatistics: publicProcedure
      .input(bucketedStatisticsInputSchema)
      .query(async ({ input }) => {
        const originsByAddress = await getAcceptsAddresses();
        return await getBucketedStatistics({
          ...input,
          addresses: Object.keys(originsByAddress),
        });
      }),
  },
});
