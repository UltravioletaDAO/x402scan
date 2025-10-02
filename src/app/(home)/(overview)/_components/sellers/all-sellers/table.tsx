'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { limit } from '../../lib/defaults';
import { useSellersSorting } from '../../../../../_contexts/sorting/sellers/hook';

export const AllSellersTable = () => {
  const sortingContext = useSellersSorting();

  const [topSellers] = api.sellers.list.all.useSuspenseQuery({
    sorting: sortingContext.sorting,
    limit,
  });

  return (
    <DataTable
      columns={columns}
      data={topSellers.items}
      href={data => `/recipient/${data.recipient}`}
    />
  );
};
