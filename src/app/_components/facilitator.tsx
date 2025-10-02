import Image from 'next/image';

import { Address } from '@/components/ui/address';
import { facilitatorMap } from '@/lib/facilitators';

import type { Address as AddressType } from 'viem';
import { cn } from '@/lib/utils';

interface Props {
  address: AddressType;
  className?: string;
}

export const Facilitator: React.FC<Props> = ({ address, className }) => {
  const facilitator = facilitatorMap.get(address);

  if (!facilitator) {
    return <Address address={address} className={className} />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src={facilitator?.image}
        alt={facilitator?.name}
        width={16}
        height={16}
        className="rounded-md"
      />
      <p className="text-xs font-semibold">{facilitator.name}</p>
    </div>
  );
};
