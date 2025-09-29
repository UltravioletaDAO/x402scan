import { createTRPCRouter, publicProcedure } from "../trpc";

import {
  listFacilitatorTransactions,
  listFacilitatorTransactionsInputSchema,
} from "@/services/cdp/sql/list-facilitator-transactions";

export const transactionsRouter = createTRPCRouter({
  listFacilitatorTransactions: publicProcedure
    .input(listFacilitatorTransactionsInputSchema)
    .query(async ({ input }) => {
      return await listFacilitatorTransactions(input);
    }),
});
