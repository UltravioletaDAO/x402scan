import { Suspense } from 'react';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { AllSellersTable } from './table';

import { Sorting } from '../../lib/sorting';
import { api, HydrateClient } from '@/trpc/server';
import { limit } from '../../lib/defaults';
import { SellersSortingProvider } from '../sorting/provider';
import { defaultSellersSorting } from '../sorting/default';

export const AllSellers = () => {
  void api.sellers.list.all.prefetch({
    sorting: defaultSellersSorting,
    limit,
  });

  return (
    <HydrateClient>
      <SellersSortingProvider initialSorting={defaultSellersSorting}>
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
          <Suspense fallback={<LoadingAllSellers />}>
            <AllSellersTable />
          </Suspense>
        </div>
      </SellersSortingProvider>
    </HydrateClient>
  );
};

export const LoadingAllSellers = () => {
  return (
    <DataTable columns={columns} data={[]} loadingRowCount={10} isLoading />
  );
};
