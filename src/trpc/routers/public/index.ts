import { createTRPCRouter } from '@/trpc/trpc';

import { publicAgentConfigurationsRouter } from './agent-configurations';
import { publicChatsRouter } from './chats';
import { originsRouter } from './origins';

export const publicRouter = createTRPCRouter({
  agentConfigurations: publicAgentConfigurationsRouter,
  chats: publicChatsRouter,
  origins: originsRouter,
});
