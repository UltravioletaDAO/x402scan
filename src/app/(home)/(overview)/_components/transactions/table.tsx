'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { limit } from '../lib/defaults';

export const LatestTransactionsTable = () => {
  const [latestTransactions] = api.transactions.list.useSuspenseQuery({
    limit,
  });

  return <DataTable columns={columns} data={latestTransactions.items} />;
};
