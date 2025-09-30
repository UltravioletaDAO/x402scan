'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';

interface Props {
  address: string;
  limit: number;
  pageSize?: number;
}

export const LatestTransactionsTable: React.FC<Props> = ({
  address,
  limit,
  pageSize,
}) => {
  const [latestTransactions] = api.transactions.list.useSuspenseQuery({
    limit,
    recipient: address,
  });

  return (
    <DataTable
      columns={columns}
      data={latestTransactions.items}
      pageSize={pageSize}
    />
  );
};

export const LoadingLatestTransactionsTable = ({
  loadingRowCount = 10,
}: {
  loadingRowCount?: number;
}) => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      loadingRowCount={loadingRowCount}
      isLoading
    />
  );
};
