import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';

export const AgentPage = async ({
  params,
}: PageProps<'/composer/agent/[id]'>) => {
  const { id } = await params;

  const agentConfiguration = await api.agentConfigurations.get({ id });

  if (!agentConfiguration) {
    return notFound();
  }

  return (
    <div>
      <h1>Agent {id}</h1>
    </div>
  );
};
