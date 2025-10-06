'use client';

import { http } from 'wagmi';
import { base } from 'wagmi/chains';

import { CDPHooksProvider as CDPHooksProviderBase } from '@coinbase/cdp-hooks';
import { createCDPEmbeddedWalletConnector } from '@coinbase/cdp-wagmi';

import { env } from '@/env';

const cdpConfig = {
  projectId: env.NEXT_PUBLIC_CDP_PROJECT_ID ?? '',
  ethereum: {},
};

export const cdpEmbeddedWalletConnector = createCDPEmbeddedWalletConnector({
  cdpConfig,
  providerConfig: {
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  },
});

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

  return (
    <CDPHooksProviderBase config={cdpConfig}>{children}</CDPHooksProviderBase>
  );
};
