import { getOverallStatistics } from "@/services/cdp/sql/overall-statistics";
import { getBucketedStatistics } from "@/services/cdp/sql/bucketed-statistics";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const statisticsRouter = createTRPCRouter({
  getOverallStatistics: publicProcedure.query(async () => {
    return await getOverallStatistics();
  }),
  getBucketedStatistics: publicProcedure.query(async () => {
    return await getBucketedStatistics();
  }),
});
