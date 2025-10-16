import { USDC_ADDRESS } from '@/lib/utils';
import { convertTokenAmount } from '@/lib/token';
import { CdpClient } from '@coinbase/cdp-sdk';
import type { EvmServerAccount } from '@coinbase/cdp-sdk';
import { getOrCreateWalletNameFromUserId } from '@/services/db/server-wallets';
import { base } from 'viem/chains';
import { createConfig, getBalance, http } from '@wagmi/core';

const cdpClient = new CdpClient();

export const getOrCreateWalletFromUserId = async (
  userId: string
): Promise<EvmServerAccount> => {
  const walletName = await getOrCreateWalletNameFromUserId(userId);
  const wallet = await cdpClient.evm.getOrCreateAccount({
    name: walletName,
  });
  return wallet;
};

export const getUSDCBaseBalanceFromUserId = async (
  userId: string
): Promise<number> => {
  const wallet = await getOrCreateWalletFromUserId(userId);
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

  return convertTokenAmount(balance.value, balance.decimals);
};

export const getWalletAddressFromUserId = async (userId: string) => {
  const wallet = await getOrCreateWalletFromUserId(userId);
  return wallet.address;
};
