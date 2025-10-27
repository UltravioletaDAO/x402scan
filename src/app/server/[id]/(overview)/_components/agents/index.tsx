import { OriginOverviewSection } from '../section';
import { api } from '@/trpc/server';
import {
  AgentCard,
  LoadingAgentCard,
} from '@/app/composer/(home)/_components/lib/agent-card';

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

export const LoadingOriginAgents = () => {
  return (
    <OriginOverviewSection title="Agents">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingAgentCard key={index} />
        ))}
      </div>
    </OriginOverviewSection>
  );
};
