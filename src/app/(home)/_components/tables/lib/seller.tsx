"use client";

import { Address } from "@/components/address";
import { Favicon } from "@/components/favicon";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/client";

interface Props {
  address: string;
}

export const Seller: React.FC<Props> = ({ address }) => {
  const { data: resource, isLoading } =
    api.resources.getResourceByAddress.useQuery(address, {
      enabled: !!address,
    });

  if (isLoading) {
    return <SellerSkeleton />;
  }

  if (!resource) {
    return <Address address={address} />;
  }

  return (
    <div className="px-1 border border-border rounded-md w-fit flex items-center gap-1">
      <Favicon url={resource.resource} size={12} />
      <p className="font-mono text-xs">{new URL(resource.resource).hostname}</p>
    </div>
  );
};

export const SellerSkeleton = () => {
  return (
    <div className="px-1 border border-border rounded-md w-fit">
      <Skeleton className="h-3 w-20 my-[2.75px]" />
    </div>
  );
};
