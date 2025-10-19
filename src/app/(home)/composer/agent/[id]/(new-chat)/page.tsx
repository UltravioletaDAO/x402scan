import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';
import { AgentChat } from '../_components/chat';

export default async function AgentPage({
  params,
}: PageProps<'/composer/agent/[id]'>) {
  const { id } = await params;

  const agentConfiguration = await api.public.agentConfigurations.get(id);

  if (!agentConfiguration) {
    return notFound();
  }

  return (
    <AgentChat
      id={id}
      initialMessages={[]}
      agentConfig={agentConfiguration}
      isReadOnly={false}
    />
  );
}
