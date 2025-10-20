import { Section } from '@/app/_components/layout/page-utils';
import { api } from '@/trpc/server';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export const Tools = async () => {
  const topTools = await api.public.tools.top({ limit: 10 });

  return (
    <Section title="Top Tools" description="Discover the most popular tools">
      <DataTable columns={columns} data={topTools} />
    </Section>
  );
};
