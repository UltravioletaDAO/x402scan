'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';

interface Props {
  addresses: string[];
  limit: number;
  pageSize?: number;
}

export const LatestTransactionsTable: React.FC<Props> = ({
  addresses,
  limit,
  pageSize,
}) => {
  const [latestTransactions] = api.transfers.list.useSuspenseQuery({
    limit,
    facilitators: addresses,
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
