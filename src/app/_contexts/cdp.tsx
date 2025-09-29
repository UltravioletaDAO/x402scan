'use client';

import { createConfig, WagmiProvider, http } from 'wagmi';
import { base } from 'wagmi/chains';

import { CDPHooksProvider as CDPHooksProviderBase } from '@coinbase/cdp-hooks';
import { createCDPEmbeddedWalletConnector } from '@coinbase/cdp-wagmi';

import { env } from '@/env';

interface Props {
  children: React.ReactNode;
}

export const CDPHooksProvider = ({ children }: Props) => {
  if (typeof window === 'undefined') {
    return children;
  }

  if (!env.NEXT_PUBLIC_CDP_PROJECT_ID) {
    return children;
  }

  const cdpConfig = {
    projectId: env.NEXT_PUBLIC_CDP_PROJECT_ID ?? '',
    ethereum: {
      createOnLogin: 'smart' as const,
    },
    solana: {
      createOnLogin: true,
    },
  };

  const connector = createCDPEmbeddedWalletConnector({
    cdpConfig,
    providerConfig: {
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    },
  });

  const wagmiConfig = createConfig({
    connectors: [connector],
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  });

  return (
    <CDPHooksProviderBase config={cdpConfig}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </CDPHooksProviderBase>
  );
};
