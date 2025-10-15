import { prisma } from './client';

import { v4 as uuid } from 'uuid';

export const getOrCreateWalletNameFromUserId = async (
  userId: string
): Promise<string> => {
  const wallet = await prisma.serverWallet.findFirst({
    where: { userId, type: 'CHAT' },
  });

  if (wallet) {
    return wallet.walletName;
  }
  const result = await prisma.serverWallet.create({
    data: {
      userId,
      walletName: uuid(),
      type: 'CHAT',
    },
    select: { walletName: true },
  });

  return result.walletName;
};
