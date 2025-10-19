import Image from 'next/image';

import { ConversationEmptyState } from '@/components/ai-elements/conversation';
import type { RouterOutputs } from '@/trpc/client';

interface Props {
  agentConfiguration: NonNullable<
    RouterOutputs['public']['agentConfigurations']['get']
  >;
}

export const AgentDisplay: React.FC<Props> = ({ agentConfiguration }) => {
  return (
    <ConversationEmptyState
      title={agentConfiguration.name}
      description={agentConfiguration.description ?? 'No description'}
      icon={
        agentConfiguration.image ? (
          <Image
            src={agentConfiguration.image}
            alt={agentConfiguration.name}
            width={96}
            height={96}
            className="size-16 rounded-md overflow-hidden"
          />
        ) : undefined
      }
    />
  );
};
