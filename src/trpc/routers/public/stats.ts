import {
  getOverallStatistics,
  overallStatisticsInputSchema,
} from '@/services/cdp/sql/stats/overall';
import {
  getBucketedStatistics,
  bucketedStatisticsInputSchema,
} from '@/services/cdp/sql/stats/bucketed';
import {
  getFirstTransferTimestampInputSchema,
  getFirstTransferTimestamp,
} from '@/services/cdp/sql/stats/first-transfer';

import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getAcceptsAddresses } from '@/services/db/resources/accepts';

export const statsRouter = createTRPCRouter({
  overall: publicProcedure
    .input(overallStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getOverallStatistics(input);
    }),
  bucketed: publicProcedure
    .input(bucketedStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getBucketedStatistics(input);
    }),

  firstTransferTimestamp: publicProcedure
    .input(getFirstTransferTimestampInputSchema)
    .query(async ({ input }) => {
      return await getFirstTransferTimestamp(input);
    }),

  bazaar: {
    overall: publicProcedure
      .input(overallStatisticsInputSchema)
      .query(async ({ input }) => {
        const originsByAddress = await getAcceptsAddresses();
        return await getOverallStatistics({
          ...input,
          addresses: Object.keys(originsByAddress),
        });
      }),
    bucketed: publicProcedure
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
