import { getResourceByAddress } from '@/services/db/resources';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { ethereumAddressSchema } from '@/lib/schemas';

export const resourcesRouter = createTRPCRouter({
  getResourceByAddress: publicProcedure
    .input(ethereumAddressSchema)
    .query(async ({ input }) => {
      return await getResourceByAddress(input);
    }),
});
