import { Section } from '@/app/_components/layout/page-utils';
import { DataTable } from '@/components/ui/data-table';
import { api } from '@/trpc/server';
import { columns } from './columns';

export const Feed = async () => {
  const feed = await api.public.agents.activity.feed({
    limit: 10,
  });

  return (
    <Section
      title="Feed"
      description="The latest activity from all x402scan agents."
    >
      <DataTable columns={columns} data={feed} />
    </Section>
  );
};

export const LoadingFeed = () => {
  return (
    <FeedContainer>
      <DataTable
        columns={columns}
        data={[]}
        isLoading={true}
        loadingRowCount={10}
      />
    </FeedContainer>
  );
};

const FeedContainer = ({ children }: { children: React.ReactNode }) => {
  return <Section title="Feed">{children}</Section>;
};
