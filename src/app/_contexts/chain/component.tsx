'use client';

import Image from 'next/image';
import { useChain } from './hook';
import type { Chain } from '@/types/chain';
import { CHAIN_LABELS, CHAIN_ICONS } from '@/types/chain';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ChainSelector = () => {
  const { chain, setChain } = useChain();

  return (
    <Select
      value={chain}
      onValueChange={value => {
        setChain(value as Chain);
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <Image
              src={CHAIN_ICONS[chain]}
              alt={CHAIN_LABELS[chain]}
              width={16}
              height={16}
              className="rounded-sm"
            />
            <span>{CHAIN_LABELS[chain]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CHAIN_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            <Image
              src={CHAIN_ICONS[value as Chain]}
              alt={label}
              width={16}
              height={16}
              className="rounded-sm"
            />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
