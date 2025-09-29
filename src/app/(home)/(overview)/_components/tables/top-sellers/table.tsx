'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from '../lib/columns';
import { useSorting } from '../../lib/sorting';
import { limit } from '../../lib/defaults';

export const TopSellersTable = () => {
  const { sorting } = useSorting();

  const [topSellers] = api.sellers.list.all.useSuspenseQuery({
    sorting,
    limit,
  });

  return <DataTable columns={columns} data={topSellers.items} />;
};
