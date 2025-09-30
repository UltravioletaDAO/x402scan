import {
  getResourceByAddress,
  searchResources,
  searchResourcesSchema,
} from '@/services/db/resources';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { ethereumAddressSchema } from '@/lib/schemas';

export const resourcesRouter = createTRPCRouter({
  getResourceByAddress: publicProcedure
    .input(ethereumAddressSchema)
    .query(async ({ input }) => {
      return await getResourceByAddress(input);
    }),
  search: publicProcedure
    .input(searchResourcesSchema)
    .query(async ({ input }) => {
      return await searchResources(input);
    }),
});
