'use client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';

import { api } from '@/trpc/client';
import { useAgentsSorting } from '@/app/_contexts/sorting/agents/hook';

export const AgentsTable = () => {
  const { sorting } = useAgentsSorting();

  const [agents] = api.public.agents.list.useSuspenseQuery({
    pagination: {
      page: 0,
      page_size: 10,
    },
    sorting,
  });

  return (
    <DataTable
      columns={columns}
      data={agents.items}
      href={({ id }) => `/composer/agent/${id}`}
    />
  );
};

export const LoadingAgentsTable = () => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      isLoading={true}
      loadingRowCount={10}
    />
  );
};
