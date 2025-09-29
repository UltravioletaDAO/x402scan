'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

import { Copyable } from './copyable';

import { cn, formatAddress } from '@/lib/utils';

interface Props {
  address: string;
  className?: string;
  hideTooltip?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  disableCopy?: boolean;
}

export const Address: React.FC<Props> = ({
  address,
  className,
  hideTooltip,
  side,
  disableCopy,
}) => {
  const formattedAddress = formatAddress(address);

  if (disableCopy) {
    return (
      <span className={cn('font-mono text-xs', className)}>
        {formattedAddress}
      </span>
    );
  }
  const addressComponent = (
    <Copyable value={address} className={cn('font-mono text-xs', className)}>
      {formattedAddress}
    </Copyable>
  );

  if (hideTooltip) {
    return addressComponent;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{addressComponent}</TooltipTrigger>
      <TooltipContent side={side}>
        <p className="font-mono">{address}</p>
      </TooltipContent>
    </Tooltip>
  );
};
