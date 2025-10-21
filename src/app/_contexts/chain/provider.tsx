'use client';

import { useState } from 'react';
import { ChainContext } from './context';
import { Chain } from '@/types/chain';

interface Props {
  children: React.ReactNode;
  initialChain?: Chain;
}

export const ChainProvider = ({ children, initialChain }: Props) => {
  const [chain, setChain] = useState<Chain>(initialChain ?? Chain.BASE);

  return (
    <ChainContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
};