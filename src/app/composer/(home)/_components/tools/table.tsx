'use client';

import { DataTable } from '@/components/ui/data-table';

import { useToolsSorting } from '@/app/_contexts/sorting/tools/hook';

import { columns } from './columns';

import { api } from '@/trpc/client';

export const ToolsTable = () => {
  const { sorting } = useToolsSorting();

  const [topTools] = api.public.tools.top.useSuspenseQuery({
    limit: 10,
    sorting,
  });

  return <DataTable columns={columns} data={topTools} />;
};

export const LoadingToolsTable = () => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      isLoading={true}
      loadingRowCount={10}
    />
  );
};
