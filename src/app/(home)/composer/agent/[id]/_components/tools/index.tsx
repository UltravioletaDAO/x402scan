import { Section } from '@/app/_components/layout/page-utils';

import { ToolCard } from './card';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  resources: RouterOutputs['public']['agentConfigurations']['get']['resources'];
}

export const Tools: React.FC<Props> = ({ resources }) => {
  return (
    <Section title="Tools" description="Tools available to the agent">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources.map(resource => (
          <ToolCard key={resource.id} resource={resource} />
        ))}
      </div>
    </Section>
  );
};
