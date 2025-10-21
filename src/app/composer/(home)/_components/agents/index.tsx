import { Section } from '@/app/_components/layout/page-utils';
import { api } from '@/trpc/server';
import { AgentCard, LoadingAgentCard } from './card';

export const Agents = async () => {
  const topAgents = await api.public.agents.list({
    limit: 4,
  });

  return (
    <AgentsContainer>
      {topAgents.map(agent => (
        <AgentCard key={agent.id} agentConfiguration={agent} />
      ))}
    </AgentsContainer>
  );
};

export const LoadingAgents = () => {
  return (
    <AgentsContainer>
      {Array.from({ length: 4 }).map((_, index) => (
        <LoadingAgentCard key={index} />
      ))}
    </AgentsContainer>
  );
};

const AgentsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Section
      title="Top Agents"
      description="Discover the most popular agents"
      href="/composer/agents"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {children}
      </div>
    </Section>
  );
};
