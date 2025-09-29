"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/trpc/client";
import { useTimeRangeContext } from "@/app/_components/time-range-selector/context";
import { useSorting } from "../lib/sorting";

export const KnownSellersTable = () => {
  const { sorting } = useSorting();
  const { startDate, endDate } = useTimeRangeContext();

  const [topSellers] = api.sellers.list.bazaar.useSuspenseQuery({
    limit: 100,
    startDate,
    endDate,
    sorting,
  });

  return (
    <DataTable
      columns={columns}
      data={topSellers.items}
      href={(data) => `/recipient/${data.recipient}`}
    />
  );
};

export const LoadingKnownSellersTable = () => {
  return (
    <DataTable columns={columns} data={[]} loadingRowCount={10} isLoading />
  );
};
