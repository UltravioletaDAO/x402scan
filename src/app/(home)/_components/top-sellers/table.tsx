"use client";

import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/client";
import { columns } from "../sellers-table/columns";
import { SortType } from "../sellers-table/types";
import { defaultSorting, limit } from "../lib/defaults";

export const TopSellersTable = () => {
  const [sorting, setSorting] = useState<SortType[]>(defaultSorting);

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
    }
  );

  return <DataTable columns={columns} data={topSellers.pages[0].items} />;
};
