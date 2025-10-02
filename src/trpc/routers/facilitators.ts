import {
  listTopFacilitators,
  listTopFacilitatorsInputSchema,
} from '@/services/cdp/sql/facilitators/list';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const facilitatorsRouter = createTRPCRouter({
  list: publicProcedure
    .input(listTopFacilitatorsInputSchema)
    .query(async ({ input }) => {
      return await listTopFacilitators(input);
    }),
});
