"use client";

import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/client";
import { columns } from "./columns";
import { useState } from "react";
import { SortingState, OnChangeFn } from "@tanstack/react-table";
import { Sorting } from "./sorting";

interface SortType {
  id: "tx_count" | "total_amount" | "latest_block_timestamp";
  desc: boolean;
}

interface Props {
  defaultSorting: SortType[];
  limit: number;
}

export const TopSellers = ({ defaultSorting, limit }: Props) => {
  const [sorting, setSorting] = useState<SortType[]>(defaultSorting);

  const [topSellers, { hasNextPage, fetchNextPage }] =
    api.sellers.list.useSuspenseInfiniteQuery(
      {
        sorting,
        limit,
      },
      {
        getNextPageParam: (lastPage, pages) =>
          lastPage.hasNextPage && lastPage.items.length > 0
            ? lastPage.items[lastPage.items.length - 1][sorting[0].id]
            : undefined,
      }
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Sellers</h2>
        <Sorting sorting={sorting} setSorting={setSorting} />
      </div>
      <DataTable columns={columns} data={topSellers.pages[0].items} />
    </div>
  );
};
