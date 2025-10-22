'use client';

import Image from 'next/image';
import { useChain } from '../../../_contexts/chain/hook';
import type { Chain } from '@/types/chain';
import { CHAIN_LABELS, CHAIN_ICONS } from '@/types/chain';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const ChainSelector = () => {
  const { chain, setChain } = useChain();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Image
            src={CHAIN_ICONS[chain]}
            alt={CHAIN_LABELS[chain]}
            width={16}
            height={16}
            className="rounded-sm"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] p-1">
        {Object.entries(CHAIN_LABELS).map(([value, label]) => (
          <Button
            key={value}
            variant="ghost"
            className="w-full justify-start gap-2 h-8"
            onClick={() => setChain(value as Chain)}
          >
            <Image
              src={CHAIN_ICONS[value as Chain]}
              alt={label}
              width={16}
              height={16}
              className="rounded-sm"
            />
            {label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
