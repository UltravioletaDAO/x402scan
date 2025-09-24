"use client";

import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/client";
import { columns } from "../sellers-table/columns";
import { limit } from "../lib/defaults";
import { useSorting } from "../sellers-table/sorting";

export const TopSellersTable = () => {
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
