'use client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { api } from '@/trpc/client';
import { useState } from 'react';

interface Props {
  limit?: number;
}

export const FeedTableContent = ({ limit = 10 }: Props) => {
  const [page, setPage] = useState(0);

  const [feed] = api.public.agents.activity.feed.useSuspenseQuery({
    limit,
    offset: page * limit,
  });

  return (
    <DataTable
      columns={columns}
      data={feed.items}
      page={page}
      onPageChange={setPage}
      pageSize={limit}
      hasNextPage={feed.hasNextPage}
    />
  );
};

export const LoadingFeedTableContent = ({ limit = 10 }: Props) => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      isLoading={true}
      loadingRowCount={limit}
    />
  );
};
