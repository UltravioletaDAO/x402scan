import { AgentsSortingProvider } from '@/app/_contexts/sorting/agents/provider';
import { OriginOverviewSection } from '../section';
import { AgentsTable } from '@/app/_components/agents/table';
import { defaultAgentsSorting } from '@/app/_contexts/sorting/agents/default';
import { api } from '@/trpc/server';
import { AgentCard } from '@/app/composer/(home)/_components/lib/agent-card';

interface Props {
  originId: string;
}

export const OriginAgents: React.FC<Props> = async ({ originId }) => {
  const agents = await api.public.agents.list({
    originId,
    pagination: {
      page: 0,
      page_size: 6,
    },
  });

  return (
    <OriginOverviewSection title="Agents">
      <div className="flex flex-col gap-4">
        {agents.items.map(agent => (
          <AgentCard key={agent.id} agentConfiguration={agent} />
        ))}
      </div>
    </OriginOverviewSection>
  );
};
