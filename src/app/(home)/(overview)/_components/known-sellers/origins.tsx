import { Globe } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import type { ResourceOrigin } from "@prisma/client";

interface Props {
  origins: ResourceOrigin[];
}

export const Origins: React.FC<Props> = ({ origins }) => {
  if (!origins || origins.length === 0) {
    return null;
  }

  const Origin = ({ origin }: { origin: ResourceOrigin }) => {
    return (
      <OriginsContainer>
        {origin.favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={origin.favicon} alt="Favicon" className="size-3" />
        ) : (
          <Globe className="size-3" />
        )}
        <p className="font-mono text-xs">
          {origin.title ?? new URL(origin.origin).hostname}
        </p>
      </OriginsContainer>
    );
  };

  return (
    <div className="relative w-full max-w-full -mx-2">
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-card to-transparent z-10" />
      <div className="flex flex-row gap-1 w-full overflow-x-auto no-scrollbar px-2">
        {origins.map((origin) => (
          <Origin key={origin.id} origin={origin} />
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-card to-transparent z-10" />
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
