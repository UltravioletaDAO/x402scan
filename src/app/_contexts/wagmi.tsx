'use client';

import {
  createConfig,
  createStorage,
  http,
  injected,
  WagmiProvider as WagmiProviderBase,
} from 'wagmi';

import { useState } from 'react';
import { createCDPEmbeddedWalletConnector } from '@coinbase/cdp-wagmi';
import { cdpConfig } from '@/app/_contexts/cdp/config';
import { base } from 'wagmi/chains';

interface Props {
  children: React.ReactNode;
}

const cdpEmbeddedWalletConnector = createCDPEmbeddedWalletConnector({
  cdpConfig,
  providerConfig: {
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  },
});

const getClientConfig = () =>
  createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
    connectors: [injected(), cdpEmbeddedWalletConnector],
    storage: createStorage({
      storage: window.localStorage,
    }),
  });

export const WagmiProvider: React.FC<Props> = ({ children }) => {
  const [config] = useState(() => getClientConfig());

  return <WagmiProviderBase config={config}>{children}</WagmiProviderBase>;
};
