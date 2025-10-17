import { getWalletsFromHeaders } from '@/lib/wallet';
import { ChatContent } from './content';
import { ConnectDialog } from './auth/connect-dialog';
import { Onboarding } from './auth/welcome';

import type { Message } from '@prisma/client';

interface Props {
  id: string;
  initialMessages: Message[];
  isReadOnly?: boolean;
}

export const Chat: React.FC<Props> = async ({
  id,
  initialMessages,
  isReadOnly,
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
      />
      {!isConnected && <ConnectDialog />}
      {isConnected && <Onboarding />}
    </>
  );
};
