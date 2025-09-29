'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';

interface Props {
  address: string;
}

export const LatestTransactionsTable: React.FC<Props> = ({ address }) => {
  const [latestTransactions] = api.transactions.list.useSuspenseQuery({
    limit: 100,
    recipient: address,
  });

  return <DataTable columns={columns} data={latestTransactions.items} />;
};
