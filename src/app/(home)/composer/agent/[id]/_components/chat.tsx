import { Chat } from '../../../_components/chat';

import type { Message } from '@prisma/client';
import type { RouterOutputs } from '@/trpc/client';

interface Props {
  id: string;
  initialMessages: Message[];
  agentConfig: NonNullable<
    RouterOutputs['public']['agentConfigurations']['get']
  >;
  isReadOnly?: boolean;
}

export const AgentChat: React.FC<Props> = async ({
  id,
  initialMessages,
  agentConfig,
  isReadOnly,
}) => {
  return (
    <Chat
      id={id}
      initialMessages={initialMessages}
      isReadOnly={isReadOnly}
      storeConfig={true}
      initialConfig={{
        model: agentConfig.model ?? undefined,
        resources: agentConfig.resources.map(resource => ({
          id: resource.resource.id,
          favicon: resource.resource.origin?.favicon ?? null,
        })),
      }}
    />
  );
};
