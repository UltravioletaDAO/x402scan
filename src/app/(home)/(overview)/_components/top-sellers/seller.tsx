'use client';

import { Skeleton } from '@/components/ui/skeleton';

import { Address } from '@/components/address';

import { Origins } from '@/app/_components/origins';
import { api } from '@/trpc/client';

interface Props {
  address: string;
}

export const Seller: React.FC<Props> = ({ address }) => {
  const { data: origins, isLoading } = api.origins.getOriginsByAddress.useQuery(
    address,
    {
      enabled: !!address,
    }
  );

  if (isLoading) {
    return <SellerSkeleton />;
  }

  if (!origins || origins.length === 0) {
    return <Address address={address} className="text-sm font-medium" />;
  }

  return <Origins origins={origins} address={address} />;
};

export const SellerSkeleton = () => {
  return <Skeleton className="h-3 w-20 my-[2.75px]" />;
};
