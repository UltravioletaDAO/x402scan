import { createTRPCRouter } from '@/trpc/trpc';

import { publicAgentConfigurationsRouter } from './agent-configurations';
import { publicChatsRouter } from './chats';
import { originsRouter } from './origins';
import { publicToolsRouter } from './tools';
import { facilitatorsRouter } from './facilitators';
import { transfersRouter } from './transfers';
import { transactionsRouter } from './transactions';
import { sellersRouter } from './sellers';
import { statsRouter } from './stats';
import { resourcesRouter } from './resources';

export const publicRouter = createTRPCRouter({
  agents: publicAgentConfigurationsRouter,
  chats: publicChatsRouter,
  origins: originsRouter,
  tools: publicToolsRouter,
  facilitators: facilitatorsRouter,
  transfers: transfersRouter,
  transactions: transactionsRouter,
  sellers: sellersRouter,
  stats: statsRouter,
  resources: resourcesRouter,
});
