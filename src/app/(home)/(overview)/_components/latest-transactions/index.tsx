import { Suspense } from 'react';

import { limit } from '../lib/defaults';

import { api, HydrateClient } from '@/trpc/server';
import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '@/app/(home)/_components/transactions';

export const LatestTransactions = () => {
  void api.transactions.list.prefetch({
    limit,
  });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Latest Transactions</h2>
          <p className="text-muted-foreground">
            Latest x402 transactions made using the Coinbase faciltiator
          </p>
        </div>
        <Suspense fallback={<LoadingLatestTransactionsTable />}>
          <LatestTransactionsTable limit={limit} />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export const LoadingLatestTransactions = () => {
  return <LoadingLatestTransactionsTable />;
};
