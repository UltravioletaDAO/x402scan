import { Section } from '@/app/_components/layout/page-utils';
import { api } from '@/trpc/server';
import { AgentCard } from './card';

export const Agents = async () => {
  const topAgents = await api.public.agents.list();

  return (
    <Section title="Top Agents" description="Discover the most popular agents">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topAgents.map(agent => (
          <AgentCard key={agent.id} agentConfiguration={agent} />
        ))}
      </div>
    </Section>
  );
};
