'use client';

import { Address } from '@/components/address';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/client';
import type { ResourceOrigin } from '@prisma/client';
import { Globe } from 'lucide-react';

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
    return <Address address={address} />;
  }

  const Origin = ({ origin }: { origin: ResourceOrigin }) => {
    return (
      <SellerContainer>
        {origin.favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={origin.favicon} alt="Favicon" className="size-3" />
        ) : (
          <Globe className="size-3" />
        )}
        <p className="font-mono text-xs">
          {origin.title ?? new URL(origin.origin).hostname}
        </p>
      </SellerContainer>
    );
  };

  return (
    <div className="flex flex-row gap-1 w-full flex-wrap">
      {origins.map(origin => (
        <Origin key={origin.id} origin={origin} />
      ))}
    </div>
  );
};

export const SellerSkeleton = () => {
  return (
    <SellerContainer>
      <Skeleton className="h-3 w-20 my-[2.75px]" />
    </SellerContainer>
  );
};

const SellerContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-1 border border-border rounded-md w-fit flex items-center gap-1">
      {children}
    </div>
  );
};
