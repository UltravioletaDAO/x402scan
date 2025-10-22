'use client';

import { useState } from 'react';
import { ChainContext } from './context';

import type { Chain } from '@/types/chain';
import { useSearchParams } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export const ChainProvider: React.FC<Props> = ({ children }) => {
  const searchParams = useSearchParams();
  const chainParam = searchParams.get('chain');
  const [chain, setChain] = useState<Chain | undefined>(
    chainParam ? (chainParam as Chain) : undefined
  );

  return (
    <ChainContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
};
