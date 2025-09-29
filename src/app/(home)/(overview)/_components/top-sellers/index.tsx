import { Suspense } from 'react';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { TopSellersTable } from './table';

import { Sorting, SortingProvider } from '../lib/sorting';
import { api, HydrateClient } from '@/trpc/server';
import { defaultSorting, limit } from '../lib/defaults';

export const TopSellers = () => {
  void api.sellers.list.all.prefetch({
    sorting: defaultSorting,
    limit,
  });

  return (
    <HydrateClient>
      <SortingProvider>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Top Sellers</h2>
              <Sorting />
            </div>
            <p className="text-muted-foreground">
              Top addresses that have received x402 transfers - known and
              unknown servers
            </p>
          </div>
          <Suspense fallback={<LoadingTopSellers />}>
            <TopSellersTable />
          </Suspense>
        </div>
      </SortingProvider>
    </HydrateClient>
  );
};

export const LoadingTopSellers = () => {
  return (
    <DataTable columns={columns} data={[]} loadingRowCount={10} isLoading />
  );
};
