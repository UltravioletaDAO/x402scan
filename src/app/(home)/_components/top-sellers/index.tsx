"use client";

import { DataTable } from "@/components/ui/data-table";
import { api } from "@/trpc/client";
import { columns } from "./columns";
import { useState } from "react";
import { CursorPagePagination } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

export const TopSellers = () => {
  const [sortType, setSortType] = useState<"tx_count" | "total_amount">();
  const [page, setPage] = useState(0);

  const [topSellers, { hasNextPage, fetchNextPage }] =
    api.sellers.list.useSuspenseInfiniteQuery(
      {
        sortType,
        limit: 100,
      },
      {
        getNextPageParam: (lastPage, pages) =>
          lastPage.hasNextPage && lastPage.items.length > 0
            ? lastPage.items[lastPage.items.length - 1][
                sortType ?? "total_amount"
              ]
            : undefined,
      }
    );

  return <DataTable columns={columns} data={topSellers.pages[page].items} />;
};
