import {
  getOverallStatistics,
  overallStatisticsInputSchema,
} from "@/services/cdp/sql/overall-statistics";
import {
  getBucketedStatistics,
  bucketedStatisticsInputSchema,
} from "@/services/cdp/sql/bucketed-statistics";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const statisticsRouter = createTRPCRouter({
  getOverallStatistics: publicProcedure
    .input(overallStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getOverallStatistics(input);
    }),
  getBucketedStatistics: publicProcedure
    .input(bucketedStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getBucketedStatistics(input);
    }),
});
