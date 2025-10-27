import { createTRPCRouter, paginatedProcedure } from '../../trpc';
import {
  listTopSellers,
  listTopSellersInputSchema,
} from '@/services/transfers/sellers/list';

import { listBazaarOrigins } from '@/services/db/bazaar/origins';
import { listBazaarOriginsInputSchema } from '@/services/db/bazaar/schema';

export const sellersRouter = createTRPCRouter({
  list: {
    all: paginatedProcedure
      .input(listTopSellersInputSchema)
      .query(async ({ input, ctx: { pagination } }) => {
        return await listTopSellers(input, pagination);
      }),
    bazaar: paginatedProcedure
      .input(listBazaarOriginsInputSchema)
      .query(async ({ input, ctx: { pagination } }) => {
        return await listBazaarOrigins(input, pagination);
      }),
  },
});
