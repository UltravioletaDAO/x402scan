import { ChatContent } from './content';
import { ConnectDialog } from './auth/connect-dialog';
import { Onboarding } from './auth/welcome';

import { serverCookieUtils } from '../../chat/_lib/cookies/server';

import { getWalletsFromHeaders } from '@/lib/wallet';

import type { Message } from '@prisma/client';
import type { RouterOutputs } from '@/trpc/client';

interface Props {
  id: string;
  initialMessages: Message[];
  agentConfig?: NonNullable<
    RouterOutputs['public']['agentConfigurations']['get']
  >;
  isReadOnly?: boolean;
  storeConfig?: boolean;
}

export const Chat: React.FC<Props> = async ({
  id,
  initialMessages,
  isReadOnly,
  storeConfig,
  agentConfig,
}) => {
  if (isReadOnly) {
    return (
      <ChatContent
        id={id}
        initialMessages={initialMessages}
        isReadOnly={isReadOnly}
      />
    );
  }

  const isConnected = await getWalletsFromHeaders()
    .then(wallets => wallets?.length && wallets.length > 0)
    .catch(() => false);

  const initialConfig = agentConfig
    ? {
        model: agentConfig.model ?? undefined,
        resources: agentConfig.resources.map(resource => ({
          id: resource.id,
          favicon: resource.originFavicon ?? null,
        })),
      }
    : await serverCookieUtils.getConfig();

  return (
    <>
      <ChatContent
        id={id}
        initialMessages={initialMessages}
        isReadOnly={isReadOnly}
        initialConfig={initialConfig}
        storeConfig={storeConfig}
        agentConfig={agentConfig}
      />
      {!isConnected && <ConnectDialog />}
      {isConnected && <Onboarding />}
    </>
  );
};
