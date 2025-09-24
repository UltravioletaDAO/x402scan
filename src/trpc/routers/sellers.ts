import { createTRPCRouter, infiniteQueryProcedure } from "../trpc";
import z from "zod";
import {
  listTopSellers,
  listTopSellersInputSchema,
} from "@/services/cdp/sql/list-top-sellers";
import { getAcceptsAddresses } from "@/services/db/accepts";

export const sellersRouter = createTRPCRouter({
  list: {
    all: infiniteQueryProcedure(z.bigint())
      .input(listTopSellersInputSchema)
      .query(async ({ input, ctx: { pagination } }) => {
        return await listTopSellers(input, pagination);
      }),
    bazaar: infiniteQueryProcedure(z.bigint())
      .input(listTopSellersInputSchema)
      .query(async ({ input, ctx: { pagination } }) => {
        const addresses = await getAcceptsAddresses();

        return await listTopSellers(
          {
            ...input,
            addresses,
          },
          pagination
        );
      }),
  },
});
