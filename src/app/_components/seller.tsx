'use client';

import { Skeleton } from '@/components/ui/skeleton';

import { Address } from '@/components/ui/address';

import { Origins } from '@/app/_components/origins';
import { api } from '@/trpc/client';
import { cn } from '@/lib/utils';

interface Props {
  address: string;
  disableCopy?: boolean;
  addressClassName?: string;
}

export const Seller: React.FC<Props> = ({
  address,
  addressClassName,
  disableCopy,
}) => {
  const { data: origins, isLoading } = api.origins.list.byAddress.useQuery(
    address,
    {
      enabled: !!address,
    }
  );

  if (isLoading) {
    return <SellerSkeleton />;
  }

  if (!origins || origins.length === 0) {
    return (
      <Address
        address={address}
        className={cn('text-sm font-medium', addressClassName)}
        disableCopy={disableCopy}
      />
    );
  }

  return <Origins origins={origins} address={address} />;
};

export const SellerSkeleton = () => {
  return <Skeleton className="h-4 w-32" />;
};
