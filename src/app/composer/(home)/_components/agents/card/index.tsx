import { Suspense } from 'react';

import {
  BotMessageSquare,
  DollarSign,
  MessagesSquare,
  Users,
  Wrench,
} from 'lucide-react';

import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Favicons } from '@/app/_components/favicon';

import { AgentCardChart, LoadingAgentCardChart } from './chart';

import type { RouterOutputs } from '@/trpc/client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface Props {
  agentConfiguration: RouterOutputs['public']['agents']['list'][number];
}

export const AgentCard: React.FC<Props> = ({ agentConfiguration }) => {
  return (
    <Link href={`/composer/agent/${agentConfiguration.id}`}>
      <Card className="hover:border-primary transition-colors overflow-hidden flex flex-col justify-between">
        <CardHeader className="border-b">
          <div className="flex flex-row items-center gap-3">
            {agentConfiguration.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agentConfiguration.image}
                alt={agentConfiguration.name}
                className="size-5 rounded object-cover bg-muted"
              />
            ) : (
              <BotMessageSquare className="size-5" />
            )}
            <CardTitle>{agentConfiguration.name}</CardTitle>
          </div>
          <CardDescription className="text-xs">
            {agentConfiguration.description ?? 'No description'}
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-7">
          <div className="md:col-span-5">
            <Suspense fallback={<LoadingAgentCardChart />}>
              <AgentCardChart agentConfigId={agentConfiguration.id} />
            </Suspense>
          </div>
          <div
            className={cn(
              'grid overflow-hidden h-full relative md:col-span-2',
              'grid-cols-2 md:grid-cols-1',
              'rounded-b-lg md:rounded-bl-none md:rounded-r-lg',
              'border-t md:border-l md:border-t-0',
              '[&>*:nth-child(odd)]:border-r md:[&>*:nth-child(odd)]:border-r-0',
              '[&>*:nth-child(-n+2)]:border-b md:[&>*:not(:last-child)]:border-b'
            )}
          >
            <StatCard title="Tools" Icon={Wrench}>
              <Favicons
                favicons={agentConfiguration.resources.map(
                  resource => resource.originFavicon ?? null
                )}
                iconContainerClassName="size-4 bg-card mt-1"
              />
            </StatCard>
            <StatCard title="Users" Icon={Users}>
              {agentConfiguration.user_count}
            </StatCard>
            <StatCard title="Requests" Icon={MessagesSquare}>
              {agentConfiguration.message_count}
            </StatCard>
            <StatCard title="Txns" Icon={DollarSign}>
              {agentConfiguration.tool_call_count}
            </StatCard>
          </div>
        </div>
      </Card>
    </Link>
  );
};

interface Stat {
  title: string;
  Icon: LucideIcon;
}

interface StatsCardProps extends Stat {
  children: React.ReactNode;
}

const StatCard = ({ children, ...stat }: StatsCardProps) => {
  return <BaseStatCard {...stat}>{children}</BaseStatCard>;
};

const BaseStatCard = ({
  title,
  children,
}: Stat & {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row justify-between items-center md:flex-col md:justify-center md:items-start flex-1 px-2 py-1">
      <p className="text-[10px] font-medium leading-none">{title}</p>
      <div className="gap-1 flex items-center justify-start text-sm font-bold font-mono">
        {children}
      </div>
    </div>
  );
};

export const LoadingAgentCard = () => {
  return (
    <Card className="justify-between flex flex-col hover:border-primary transition-colors overflow-hidden">
      <CardHeader>
        <div className="flex flex-row items-center gap-3">
          <Skeleton className="size-5" />
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-full h-4" />
      </CardHeader>
      <div className="pb-2">
        <LoadingAgentCardChart />
      </div>
      <CardFooter className="justify-between text-xs pt-4 border-t">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-1">
            <Skeleton className="size-3" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="flex flex-row items-center gap-1">
            <Skeleton className="size-3" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
