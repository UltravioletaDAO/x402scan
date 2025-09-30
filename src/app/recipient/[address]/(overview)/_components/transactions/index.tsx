import { Suspense } from 'react';

import { DataTable } from '@/components/ui/data-table';

import { columns } from '../../../_components/transactions/columns';
import { LatestTransactionsTable } from '../../../_components/transactions/table';

import { api, HydrateClient } from '@/trpc/server';

interface Props {
  address: string;
}

export const LatestTransactions: React.FC<Props> = ({ address }) => {
  void api.transactions.list.prefetch({
    limit: 100,
    recipient: address,
  });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Transactions</h2>
          </div>
          <p className="text-muted-foreground">
            Latest x402 transactions to this server address
          </p>
        </div>
        <Suspense fallback={<LoadingLatestTransactions />}>
          <LatestTransactionsTable
            address={address}
            limit={100}
            pageSize={10}
          />
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
