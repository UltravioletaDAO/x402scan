'use client';

import {
  createConfig,
  http,
  injected,
  WagmiProvider as WagmiProviderBase,
} from 'wagmi';

import { baseWagmiConfig } from './config';

import type { State } from 'wagmi';
import { useState } from 'react';
import { createCDPEmbeddedWalletConnector } from '@coinbase/cdp-wagmi';
import { cdpConfig } from '../cdp/config';
import { base } from 'wagmi/chains';

interface Props {
  children: React.ReactNode;
  initialState: State | undefined;
}

export const cdpEmbeddedWalletConnector = createCDPEmbeddedWalletConnector({
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
    ...baseWagmiConfig,
    connectors: [cdpEmbeddedWalletConnector, injected()],
  });

export const WagmiProviderClient: React.FC<Props> = ({
  children,
  initialState,
}) => {
  const [config] = useState(() => getClientConfig());

  return (
    <WagmiProviderBase config={config} initialState={initialState}>
      {children}
    </WagmiProviderBase>
  );
};
