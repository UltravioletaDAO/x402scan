'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { useTransfersSorting } from '@/app/_contexts/sorting/transfers/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';

interface Props {
  facilitatorId: string;
  limit: number;
  pageSize?: number;
}

export const LatestTransactionsTable: React.FC<Props> = ({
  facilitatorId,
  limit,
  pageSize,
}) => {
  const { sorting } = useTransfersSorting();
  const { startDate, endDate } = useTimeRangeContext();

  const [latestTransactions] = api.public.transfers.list.useSuspenseQuery({
    pagination: {
      page_size: limit,
    },
    facilitatorIds: [facilitatorId],
    sorting,
    startDate,
    endDate,
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
