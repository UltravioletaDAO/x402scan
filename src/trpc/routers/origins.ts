import { ethereumAddressSchema } from "@/lib/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getOriginsByAddress } from "@/services/db/origin";

export const originsRouter = createTRPCRouter({
  getOriginsByAddress: publicProcedure
    .input(ethereumAddressSchema)
    .query(async ({ input }) => {
      return await getOriginsByAddress(input);
    }),
});
