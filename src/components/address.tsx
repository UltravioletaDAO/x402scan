'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

import { Copyable } from './copyable';

import { cn, formatAddress } from '@/lib/utils';

interface Props {
  address: string;
  className?: string;
  hideTooltip?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Address: React.FC<Props> = ({
  address,
  className,
  hideTooltip,
  side,
}) => {
  const addressComponent = (
    <Copyable
      value={address}
      className={cn('font-mono text-xs border rounded-md px-1', className)}
    >
      {formatAddress(address)}
    </Copyable>
  );

  if (hideTooltip) {
    return addressComponent;
  }

  return (
    <Tooltip>
      <TooltipTrigger>{addressComponent}</TooltipTrigger>
      <TooltipContent side={side}>
        <p className="font-mono">{address}</p>
      </TooltipContent>
    </Tooltip>
  );
};
