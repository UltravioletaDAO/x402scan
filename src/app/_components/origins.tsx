import { Globe, Server } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

import { Address, Addresses } from '@/components/ui/address';

import { cn } from '@/lib/utils';

import type { ResourceOrigin } from '@prisma/client';

interface Props {
  address: string;
  origins: ResourceOrigin[];
}

export const Origins: React.FC<Props> = ({ origins, address }) => {
  if (!origins || origins.length === 0) {
    return <Address address={address} />;
  }

  if (origins.length === 1) {
    const origin = origins[0];
    return (
      <OriginsContainer
        Icon={({ className }) =>
          origin.favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={origin.favicon} alt="Favicon" className={className} />
          ) : (
            <Globe className={className} />
          )
        }
        title={new URL(origin.origin).hostname}
        address={
          <Address address={address} className="border-none p-0" hideTooltip />
        }
      />
    );
  }

  return (
    <OriginsContainer
      Icon={({ className }) => <Server className={className} />}
      title={
        <Tooltip>
          <TooltipTrigger className="cursor-pointer hover:bg-muted hover:text-muted-foreground rounded-md transition-colors">
            {origins.length} servers
          </TooltipTrigger>
          <TooltipContent className="max-w-sm flex flex-col gap-1">
            <p>
              Addresses can be associated with multiple servers.
              <br />
              This address is associated with the following servers:
            </p>
            <ul className="list-disc list-inside">
              {origins.map(origin => (
                <li key={origin.id}>
                  {origin.title ?? new URL(origin.origin).hostname}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      }
      address={
        <Address address={address} className="border-none p-0" hideTooltip />
      }
    />
  );
};

interface OriginProps {
  origin: ResourceOrigin;
  addresses: string[];
}

export const Origin: React.FC<OriginProps> = ({ origin, addresses }) => {
  return (
    <OriginsContainer
      Icon={({ className }) =>
        origin.favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={origin.favicon} alt="Favicon" className={className} />
        ) : (
          <Globe className={className} />
        )
      }
      title={new URL(origin.origin).hostname}
      address={
        <Addresses
          addresses={addresses}
          className="border-none p-0"
          hideTooltip
        />
      }
    />
  );
};

export const OriginsSkeleton = () => {
  return (
    <OriginsContainer
      Icon={({ className }) => (
        <Skeleton className={cn('rounded-full', className)} />
      )}
      title={<Skeleton className="h-[14px] w-32 my-[3px]" />}
      address={<Skeleton className="h-3 w-20 my-[2px]" />}
    />
  );
};

interface OriginsContainerProps {
  Icon: ({ className }: { className: string }) => React.ReactNode;
  title: React.ReactNode;
  address: React.ReactNode;
}

const OriginsContainer = ({ Icon, title, address }: OriginsContainerProps) => {
  return (
    <div className="flex items-center gap-2 w-full overflow-hidden">
      <Icon className="size-6" />
      <div className="flex-1 overflow-hidden">
        <div className="text-sm font-mono font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </div>
        <div>{address}</div>
      </div>
    </div>
  );
};
