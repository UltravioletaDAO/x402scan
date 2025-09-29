"use client";

import { DataTable } from "@/components/ui/data-table";

import { columns } from "../lib/columns";
import { limit } from "../../lib/defaults";
import { useSorting } from "../../lib/sorting";

import { api } from "@/trpc/client";

export const TopResourcesTable = () => {
  const { sorting } = useSorting();

  const [topSellers] = api.sellers.list.bazaar.useSuspenseInfiniteQuery(
    {
      sorting,
      limit,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage && lastPage.items.length > 0
          ? lastPage.items[lastPage.items.length - 1][sorting[0].id]
          : undefined,
    }
  );

  return <DataTable columns={columns} data={topSellers.pages[0].items} />;
};
