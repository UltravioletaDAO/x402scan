'use client';

import { DataTable } from '@/components/ui/data-table';

import { useSellersSorting } from '../sorting/hook';
import { useTimeRangeContext } from '@/app/_components/time-range-selector/context';

import { columns } from './columns';
import { api } from '@/trpc/client';

export const KnownSellersTable = () => {
  const { sorting } = useSellersSorting();
  const { startDate, endDate } = useTimeRangeContext();

  const [topSellers] = api.sellers.list.bazaar.useSuspenseQuery({
    startDate,
    endDate,
    sorting,
  });

  return (
    <DataTable
      columns={columns}
      data={topSellers.items}
      href={data => `/recipient/${data.recipient}`}
    />
  );
};

export const LoadingKnownSellersTable = () => {
  return (
    <DataTable columns={columns} data={[]} loadingRowCount={10} isLoading />
  );
};
