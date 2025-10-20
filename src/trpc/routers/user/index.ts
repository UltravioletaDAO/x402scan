import { createTRPCRouter } from '../../trpc';

import { userAgentConfigurationsRouter } from './agent-configurations';
import { userChatsRouter } from './chats';
import { userFreeTierRouter } from './free-tier';
import { onrampSessionsRouter } from './onramp-sessions';
import { serverWalletRouter } from './server-wallet';
import { userToolsRouter } from './tools';
import { uploadRouter } from './upload';

export const userRouter = createTRPCRouter({
  agentConfigurations: userAgentConfigurationsRouter,
  chats: userChatsRouter,
  onrampSessions: onrampSessionsRouter,
  serverWallet: serverWalletRouter,
  upload: uploadRouter,
  tools: userToolsRouter,
  freeTier: userFreeTierRouter,
});
