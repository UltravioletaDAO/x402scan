import { Suspense } from 'react';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { LatestTransactionsTable } from './table';

import { api, HydrateClient } from '@/trpc/server';
import { limit } from '../lib/defaults';

export const LatestTransactions = () => {
  void api.transactions.list.prefetch({
    limit,
  });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Transactions</h2>
          </div>
          <p className="text-muted-foreground">
            Latest x402 transactions made using the Coinbase x402 faciltiator
          </p>
        </div>
        <Suspense fallback={<LoadingLatestTransactions />}>
          <LatestTransactionsTable />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export const LoadingLatestTransactions = () => {
  return (
    <DataTable columns={columns} data={[]} loadingRowCount={10} isLoading />
  );
};
