import { api, HydrateClient } from "@/trpc/server";

import { SellersTable } from "../sellers-table";

import { TopSellersTable } from "./table";
import { defaultSorting, limit } from "../lib/defaults";

export const TopResources = () => {
  void api.sellers.list.bazaar.prefetchInfinite({
    sorting: defaultSorting,
    limit,
  });

  return (
    <HydrateClient>
      <SellersTable
        title="Top Bazaar Resources"
        description="Top resources listed in the bazaar by tx count, total amount, and latest transaction"
      >
        <TopSellersTable />
      </SellersTable>
    </HydrateClient>
  );
};
