'use client';

import type { Chain } from '@/types/chain';
import { DEFAULT_CHAIN } from '@/types/chain';
import { createContext } from 'react';

interface ChainContextType {
  chain: Chain;
  setChain: (chain: Chain) => void;
}

export const ChainContext = createContext<ChainContextType>({
  chain: DEFAULT_CHAIN,
  setChain: () => {
    void 0;
  },
});
