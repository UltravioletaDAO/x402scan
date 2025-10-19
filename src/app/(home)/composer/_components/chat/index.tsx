import { ChatContent } from './content';
import { ConnectDialog } from './auth/connect-dialog';
import { Onboarding } from './auth/welcome';

import { getWalletsFromHeaders } from '@/lib/wallet';

import type { Message } from '@prisma/client';
import type { ChatConfig } from '../../_types/chat-config';

interface Props {
  id: string;
  initialMessages: Message[];
  initialConfig?: ChatConfig;
  isReadOnly?: boolean;
  storeConfig?: boolean;
}

export const Chat: React.FC<Props> = async ({
  id,
  initialMessages,
  isReadOnly,
  storeConfig,
  initialConfig,
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

  return (
    <>
      <ChatContent
        id={id}
        initialMessages={initialMessages}
        isReadOnly={isReadOnly}
        initialConfig={initialConfig}
        storeConfig={storeConfig}
      />
      {!isConnected && <ConnectDialog />}
      {isConnected && <Onboarding />}
    </>
  );
};
