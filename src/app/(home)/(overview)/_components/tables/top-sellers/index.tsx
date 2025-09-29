import { api, HydrateClient } from "@/trpc/server";

import { SellersTable } from "../lib";

import { TopSellersTable } from "./table";

import { defaultSorting, limit } from "../../lib/defaults";

export const TopSellers = () => {
  void api.sellers.list.all.prefetchInfinite({
    sorting: defaultSorting,
    limit,
  });

  return (
    <HydrateClient>
      <SellersTable
        title="Top Sellers"
        description="Top sellers by tx count, total amount, and latest transaction"
      >
        <TopSellersTable />
      </SellersTable>
    </HydrateClient>
  );
};
