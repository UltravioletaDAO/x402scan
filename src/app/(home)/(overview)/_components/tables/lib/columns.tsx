"use client";

import type { LucideIcon } from "lucide-react";
import { Calendar, DollarSign, Hash, Store } from "lucide-react";

import { formatTokenAmount } from "@/lib/token";

import type { RouterOutputs } from "@/trpc/client";
import { Seller, SellerSkeleton } from "./seller";
import { cn, formatCompactAgo } from "@/lib/utils";

import type { ExtendedColumnDef } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

type ColumnType = RouterOutputs["sellers"]["list"]["all"]["items"][number];

export const columns: ExtendedColumnDef<ColumnType>[] = [
  {
    accessorKey: "recipient",
    header: () => (
      <HeaderCell Icon={Store} label="Seller" className="justify-start" />
    ),
    cell: ({ row }) => <Seller address={row.original.recipient} />,
    size: 300, // Fixed width for seller column (widest for address display)
    loading: () => <SellerSkeleton />,
  },
  {
    accessorKey: "tx_count",
    header: () => <HeaderCell Icon={Hash} label="Txns" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {row.original.tx_count.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>
    ),
    size: 100, // Fixed width for transaction count
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: "unique_buyers",
    header: () => <HeaderCell Icon={Hash} label="Buyers" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {row.original.unique_buyers.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>
    ),
    size: 100, // Fixed width for buyers count
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: "latest_block_timestamp",
    header: () => <HeaderCell Icon={Calendar} label="Latest" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {formatCompactAgo(row.original.latest_block_timestamp)}
      </div>
    ),
    size: 120, // Fixed width for timestamp
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: "total_amount",
    header: () => (
      <HeaderCell Icon={DollarSign} label="Volume" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono font-semibold text-xs">
        {formatTokenAmount(row.original.total_amount)}
      </div>
    ),
    size: 150, // Fixed width for volume column
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
        "flex items-center justify-center gap-2 text-sm",
        className
      )}
    >
      <Icon className="size-4" />
      {label}
    </div>
  );
};
