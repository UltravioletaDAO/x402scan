'use client';

import { DataTable } from '@/components/ui/data-table';

import { useToolsSorting } from '@/app/_contexts/sorting/tools/hook';

import { columns } from './columns';

import { api } from '@/trpc/client';
import { useState } from 'react';

export const ToolsTable = () => {
  const { sorting } = useToolsSorting();

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [topTools] = api.public.tools.top.useSuspenseQuery({
    pagination: {
      page: 0,
      page_size: 10,
    },
    sorting,
  });

  return (
    <DataTable
      columns={columns}
      data={topTools.items}
      pageSize={pageSize}
      hasNextPage={topTools.hasNextPage}
      page={page}
      onPageChange={setPage}
    />
  );
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
