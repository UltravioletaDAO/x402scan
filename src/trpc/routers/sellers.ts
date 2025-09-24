import { createTRPCRouter, infiniteQueryProcedure } from "../trpc";
import z from "zod";
import {
  listTopSellers,
  listTopSellersInputSchema,
} from "@/services/base-sql/list-top-sellers";

export const sellersRouter = createTRPCRouter({
  list: infiniteQueryProcedure(z.bigint())
    .input(listTopSellersInputSchema)
    .query(async ({ input, ctx: { pagination } }) => {
      return await listTopSellers(input, pagination);
    }),
});
