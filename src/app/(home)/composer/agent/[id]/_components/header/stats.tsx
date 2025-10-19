import { cn } from '@/lib/utils';
import type { RouterOutputs } from '@/trpc/client';
import {
  Calendar,
  MessagesSquare,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

interface Props {
  agentConfiguration: NonNullable<
    RouterOutputs['public']['agentConfigurations']['get']
  >;
}

export const AgentStats: React.FC<Props> = ({ agentConfiguration }) => {
  return (
    <div
      className={cn(
        'grid overflow-hidden h-full relative',
        'grid-cols-2 md:grid-cols-1',
        'rounded-b-lg md:rounded-bl-none md:rounded-r-lg',
        'border-t md:border-l md:border-t-0',
        '[&>*:nth-child(odd)]:border-r md:[&>*:nth-child(odd)]:border-r-0',
        '[&>*:nth-child(-n+2)]:border-b md:[&>*:not(:last-child)]:border-b'
      )}
    >
      <BaseStatCard
        title="Users"
        value={agentConfiguration.userCount.toString()}
        Icon={Users}
      />
      <BaseStatCard
        title="Messages"
        value={agentConfiguration.messageCount.toString()}
        Icon={MessagesSquare}
      />
      <BaseStatCard
        title="Tool Calls"
        value={agentConfiguration.toolCallCount.toString()}
        Icon={Wrench}
      />
      <BaseStatCard
        title="Created At"
        value={agentConfiguration.createdAt.toLocaleDateString()}
        Icon={Calendar}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
}

const BaseStatCard: React.FC<StatCardProps> = ({ title, value, Icon }) => {
  return (
    <div className="flex justify-between flex-1 px-4 gap-2 py-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="text-xs font-medium tracking-wider">{title}</span>
      </div>
      <div className="text-lg font-bold font-mono">{value}</div>
    </div>
  );
};
