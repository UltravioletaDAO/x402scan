'use client';

import {
  Activity,
  ArrowLeftRight,
  Calendar,
  DollarSign,
  Server,
  Users,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

import { KnownSellerChart, LoadingKnownSellerChart } from './chart';

import { Origins, OriginsSkeleton } from '../../../../_components/origins';

import { cn, formatCompactAgo } from '@/lib/utils';
import { formatTokenAmount } from '@/lib/token';

import type { LucideIcon } from 'lucide-react';
import type { ExtendedColumnDef } from '@/components/ui/data-table';
import type { RouterOutputs } from '@/trpc/client';

type ColumnType = RouterOutputs['sellers']['list']['bazaar']['items'][number];

export const columns: ExtendedColumnDef<ColumnType>[] = [
  {
    accessorKey: 'recipient',
    header: () => (
      <HeaderCell Icon={Server} label="Server" className="justify-start" />
    ),
    cell: ({ row }) => (
      <Origins
        origins={row.original.origins}
        address={row.original.recipient}
      />
    ),
    size: 400,
    loading: () => <OriginsSkeleton />,
  },
  {
    accessorKey: 'chart',
    header: () => <HeaderCell Icon={Activity} label="Activity" />,
    cell: ({ row }) => <KnownSellerChart address={row.original.recipient} />,
    size: 100,
    loading: () => <LoadingKnownSellerChart />,
  },
  {
    accessorKey: 'tx_count',
    header: () => <HeaderCell Icon={ArrowLeftRight} label="Txns" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {row.original.tx_count.toLocaleString(undefined, {
          notation: 'compact',
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>
    ),
    size: 100, // Fixed width for transaction count
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: 'unique_buyers',
    header: () => <HeaderCell Icon={Users} label="Buyers" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {row.original.unique_buyers.toLocaleString(undefined, {
          notation: 'compact',
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>
    ),
    size: 100, // Fixed width for buyers count
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: 'latest_block_timestamp',
    header: () => <HeaderCell Icon={Calendar} label="Last Used" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {formatCompactAgo(row.original.latest_block_timestamp)}
      </div>
    ),
    size: 100, // Fixed width for timestamp
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: 'total_amount',
    header: () => (
      <HeaderCell Icon={DollarSign} label="Volume" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono font-semibold text-xs">
        {formatTokenAmount(row.original.total_amount)}
      </div>
    ),
    size: 100, // Fixed width for volume column
    loading: () => <Skeleton className="h-4 w-16 ml-auto" />,
  },
];

interface HeaderCellProps {
  Icon: LucideIcon;
  label: string;
  className?: string;
}

const HeaderCell: React.FC<HeaderCellProps> = ({ Icon, label, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 text-sm text-muted-foreground',
        className
      )}
    >
      <Icon className="size-3" />
      {label}
    </div>
  );
};
