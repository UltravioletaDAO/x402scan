import { ethereumAddressSchema } from '@/lib/schemas';
import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  listOriginsByAddress,
  listOriginsWithResources,
  searchOrigins,
  searchOriginsSchema,
} from '@/services/db/origin';

export const originsRouter = createTRPCRouter({
  list: {
    byAddress: publicProcedure
      .input(ethereumAddressSchema)
      .query(async ({ input }) => {
        return await listOriginsByAddress(input);
      }),

    withResources: publicProcedure
      .input(ethereumAddressSchema)
      .query(async ({ input }) => {
        return await listOriginsWithResources(input);
      }),
  },
  search: publicProcedure
    .input(searchOriginsSchema)
    .query(async ({ input }) => {
      return await searchOrigins(input);
    }),
});
