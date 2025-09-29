import { createTRPCRouter, publicProcedure } from '../trpc';

import {
  listFacilitatorTransactions,
  listFacilitatorTransactionsInputSchema,
} from '@/services/cdp/sql/list-facilitator-transactions';

export const transactionsRouter = createTRPCRouter({
  list: publicProcedure
    .input(listFacilitatorTransactionsInputSchema)
    .query(async ({ input }) => {
      return await listFacilitatorTransactions(input);
    }),
});
