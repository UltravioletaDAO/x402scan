import { USDC_ADDRESS } from '@/lib/utils';
import { convertTokenAmount } from '@/lib/token';
import { CdpClient } from '@coinbase/cdp-sdk';
import {
  createWalletNameForUserId,
  getWalletNameForUserId,
} from '@/services/db/server-wallets';
import { base } from 'viem/chains';
import { createConfig, getBalance, http } from '@wagmi/core';

const cdpClient = new CdpClient();

export const getWalletForUserId = async (userId: string) => {
  const walletName = await getWalletNameForUserId(userId);
  if (!walletName) {
    return null;
  }
  const wallet = await cdpClient.evm.getAccount({
    name: walletName,
  });
  return wallet;
};

export const getUSDCBaseBalanceFromUserId = async (
  userId: string
): Promise<number> => {
  const wallet = await getWalletForUserId(userId);
  if (!wallet) {
    return 0;
  }
  const balance = await getBalance(
    createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    }),
    {
      address: wallet.address,
      chainId: base.id,
      token: USDC_ADDRESS,
    }
  );

  console.log('wallet', wallet.address);

  console.log('balance', balance);

  return convertTokenAmount(balance.value, balance.decimals);
};

export const getWalletAddressFromUserId = async (userId: string) => {
  const wallet = await getWalletForUserId(userId);
  if (!wallet) {
    return null;
  }
  return wallet.address;
};

export const createWalletForUserId = async (userId: string) => {
  const walletName = await createWalletNameForUserId(userId);
  const wallet = await cdpClient.evm.createAccount({
    name: walletName,
  });
  return wallet;
};
