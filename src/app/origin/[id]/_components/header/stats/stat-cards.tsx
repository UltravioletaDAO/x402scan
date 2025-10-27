import { HardDrive, Tag, Wallet } from 'lucide-react';

import { api } from '@/trpc/server';

import { Addresses } from '@/components/ui/address';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import type { LucideIcon } from 'lucide-react';

interface Props {
  originId: string;
}

interface Stat {
  title: string;
  Icon: LucideIcon;
}

const stats: Stat[] = [
  { title: 'Resources', Icon: HardDrive },
  { title: 'Tags', Icon: Tag },
  { title: 'Addresses', Icon: Wallet },
];

export const StatsCards: React.FC<Props> = async ({ originId }) => {
  const metadata = await api.public.origins.getMetadata(originId);
  if (!metadata) {
    return null;
  }

  const values = [
    metadata.resources.length,
    <div key="tags" className="flex flex-wrap gap-1">
      {Array.from(
        new Set(
          metadata.resources.flatMap(resource =>
            resource.tags.map(tag => tag.tag)
          )
        )
      ).map(tag => (
        <Badge key={tag.id}>{tag.name}</Badge>
      ))}
    </div>,
    <Addresses
      key="addresses"
      addresses={Array.from(
        new Set(
          metadata.resources.flatMap(resource =>
            resource.accepts.map(accept => accept.payTo)
          )
        )
      )}
    />,
  ];

  return stats.map((stat, index) => (
    <StatCard key={stat.title} {...stat} value={values[index]} />
  ));
};

export const LoadingStatsCards = () => {
  return stats.map(stat => <LoadingStatCard {...stat} key={stat.title} />);
};

interface StatsCardProps extends Stat {
  value: React.ReactNode;
}

const StatCard = ({ value, ...stat }: StatsCardProps) => {
  return (
    <BaseStatCard {...stat}>
      <div className="text-lg font-bold font-mono">{value}</div>
    </BaseStatCard>
  );
};

const LoadingStatCard = (stat: Stat) => {
  return (
    <BaseStatCard {...stat}>
      <Skeleton className="w-16 h-[28px]" />
    </BaseStatCard>
  );
};

const BaseStatCard = ({
  title,
  Icon,
  children,
}: Stat & {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between flex-1 px-4 gap-2 py-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="text-xs font-medium tracking-wider">{title}</span>
      </div>
      <div className="gap-1 flex items-center">{children}</div>
    </div>
  );
};
