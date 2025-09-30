'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';

interface Props {
  limit: number;
  pageSize?: number;
}

export const Table: React.FC<Props> = ({ limit, pageSize }) => {
  const [latestTransactions] = api.transactions.list.useSuspenseQuery({
    limit,
  });

  return (
    <DataTable
      columns={columns}
      data={latestTransactions.items}
      pageSize={pageSize}
    />
  );
};
