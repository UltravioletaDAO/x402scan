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

  console.log(hasNextPage);

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden">
        <DataTable columns={columns} data={topSellers.pages[page].items} />
      </Card>
      <CursorPagePagination
        page={page + 1}
        onPrevious={page > 0 ? () => setPage(page - 1) : undefined}
        onNext={
          page < topSellers.pages.length - 1
            ? () => setPage(page + 1)
            : hasNextPage
            ? fetchNextPage
            : undefined
        }
      />
    </div>
  );
};
