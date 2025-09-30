import { Skeleton } from '@/components/ui/skeleton';

import { Address } from '@/components/address';

import { cn } from '@/lib/utils';

import type { Accepts, ResourceOrigin, Resources } from '@prisma/client';
import { Favicon } from '@/components/favicon';

interface Props {
  resource: Resources & {
    accepts: Accepts[];
    origin: ResourceOrigin;
  };
}

export const Resource: React.FC<Props> = ({ resource }) => {
  return (
    <ResourceContainer
      Icon={({ className }) => (
        <Favicon url={resource.origin.favicon} className={className} />
      )}
      title={`${new URL(resource.origin.origin).hostname}${new URL(resource.resource).pathname}`}
      address={
        <Address
          address={resource.accepts[0].payTo}
          className="border-none p-0"
          hideTooltip
        />
      }
    />
  );
};

export const ResourceSkeleton = () => {
  return (
    <ResourceContainer
      Icon={({ className }) => (
        <Skeleton className={cn('rounded-full', className)} />
      )}
      title={<Skeleton className="h-[14px] w-32 my-[3px]" />}
      address={<Skeleton className="h-3 w-20 my-[2px]" />}
    />
  );
};

interface ResourceContainerProps {
  Icon: ({ className }: { className: string }) => React.ReactNode;
  title: React.ReactNode;
  address: React.ReactNode;
}

const ResourceContainer = ({
  Icon,
  title,
  address,
}: ResourceContainerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-6" />
      <div>
        <div className="text-sm font-mono font-semibold">{title}</div>
        <div>{address}</div>
      </div>
    </div>
  );
};
