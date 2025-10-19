import { Body } from '@/app/_components/layout/page-utils';
import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';
import { HeaderCard } from './_components/header';

export default async function AgentPage({
  params,
}: PageProps<'/composer/agent/[id]'>) {
  const { id } = await params;

  const agentConfiguration = await api.public.agentConfigurations.get(id);

  if (!agentConfiguration) {
    return notFound();
  }

  return (
    <Body className="gap-8 pt-0">
      <HeaderCard agentConfiguration={agentConfiguration} />
    </Body>
  );
}
