import { Globe, Server } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import type { ResourceOrigin } from "@prisma/client";
import { Address } from "@/components/address";

interface Props {
  address: string;
  origins: ResourceOrigin[];
}

export const Origins: React.FC<Props> = ({ origins, address }) => {
  if (!origins || origins.length === 0) {
    return null;
  }

  if (origins.length === 1) {
    const origin = origins[0];
    return (
      <div className="flex items-center gap-2">
        {origin.favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={origin.favicon} alt="Favicon" className="size-6" />
        ) : (
          <Globe className="size-6" />
        )}
        <div>
          <h3 className="text-sm font-mono font-semibold">
            {new URL(origin.origin).hostname}
          </h3>
          <Address address={address} className="border-none p-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Server className="size-6" />
      <div>
        <h3 className="text-sm font-mono font-semibold">
          {origins.length} servers
        </h3>
        <Address address={address} className="border-none p-0" />
      </div>
    </div>
  );
};

export const OriginsSkeleton = () => {
  return (
    <OriginsContainer>
      <Skeleton className="h-3 w-20 my-[2.75px]" />
    </OriginsContainer>
  );
};

const OriginsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-1 border border-border rounded-md w-fit flex items-center gap-1 shrink-0">
      {children}
    </div>
  );
};
