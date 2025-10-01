import { ethereumHashSchema } from '@/lib/schemas';
import { createTRPCRouter, publicProcedure } from '../trpc';

import {
  listFacilitatorTransfers,
  listFacilitatorTransactionsInputSchema,
} from '@/services/cdp/sql/transfers/list';
import { getTransaction } from '@/services/cdp/sql/transactions/get';

export const transactionsRouter = createTRPCRouter({
  get: publicProcedure.input(ethereumHashSchema).query(async ({ input }) => {
    return await getTransaction(input);
  }),
  list: publicProcedure
    .input(listFacilitatorTransactionsInputSchema)
    .query(async ({ input }) => {
      return await listFacilitatorTransfers(input);
    }),
});
