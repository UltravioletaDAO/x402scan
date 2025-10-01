import { ethereumHashSchema } from '@/lib/schemas';
import { createTRPCRouter, publicProcedure } from '../trpc';

import {
  listFacilitatorTransactions,
  listFacilitatorTransactionsInputSchema,
} from '@/services/cdp/sql/list-facilitator-transactions';
import { getTransaction } from '@/services/cdp/sql/transaction';

export const transactionsRouter = createTRPCRouter({
  get: publicProcedure.input(ethereumHashSchema).query(async ({ input }) => {
    return await getTransaction(input);
  }),
  list: publicProcedure
    .input(listFacilitatorTransactionsInputSchema)
    .query(async ({ input }) => {
      return await listFacilitatorTransactions(input);
    }),
});
