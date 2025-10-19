'use client';

import { AgentDisplay } from './agent-display';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  agentConfiguration: NonNullable<
    RouterOutputs['public']['agentConfigurations']['get']
  >;
}

export const Connect: React.FC<Props> = ({ agentConfiguration }) => {
  return <AgentDisplay agentConfiguration={agentConfiguration} />;
};
