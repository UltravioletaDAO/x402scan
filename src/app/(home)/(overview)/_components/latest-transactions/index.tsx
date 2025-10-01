import { Suspense } from 'react';

import { limit } from '../lib/defaults';

import { api, HydrateClient } from '@/trpc/server';
import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '@/app/(home)/_components/transactions';

export const LatestTransactions = () => {
  void api.transfers.list.prefetch({
    limit,
  });

  return (
    <HydrateClient>
      <LatestTransactionsTableContainer>
        <Suspense fallback={<LoadingLatestTransactionsTable />}>
          <LatestTransactionsTable limit={limit} />
        </Suspense>
      </LatestTransactionsTableContainer>
    </HydrateClient>
  );
};

export const LoadingLatestTransactions = () => {
  return (
    <LatestTransactionsTableContainer>
      <LoadingLatestTransactionsTable />
    </LatestTransactionsTableContainer>
  );
};

const LatestTransactionsTableContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold">Latest Transactions</h2>
        <p className="text-muted-foreground">
          Latest x402 transactions made using the Coinbase faciltiator
        </p>
      </div>
      {children}
    </div>
  );
};
