"use client";

import { api } from "@/trpc/client";

import { DataTable } from "@/components/ui/data-table";

import { columns } from "../lib/columns";
import { useSorting } from "../../lib/sorting";
import { limit } from "../../lib/defaults";

export const TopSellersTable = () => {
  const { sorting } = useSorting();

  const [topSellers] = api.sellers.list.all.useSuspenseInfiniteQuery(
    {
      sorting,
      limit,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage && lastPage.items.length > 0
          ? lastPage.items[lastPage.items.length - 1][sorting[0].id]
          : undefined,
    },
  );

  return <DataTable columns={columns} data={topSellers.pages[0].items} />;
};
