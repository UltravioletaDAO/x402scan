import { api, HydrateClient } from "@/trpc/server";

import { SellersTable } from "../lib";

import { TopResourcesTable } from "./table";
import { defaultSorting, limit } from "../lib/defaults";

export const TopResources = () => {
  void api.sellers.list.bazaar.prefetchInfinite({
    sorting: defaultSorting,
    limit,
  });

  return (
    <HydrateClient>
      <SellersTable
        title="Top Known Sellers"
        description="Top seller origins grouped by address"
      >
        <TopResourcesTable />
      </SellersTable>
    </HydrateClient>
  );
};
