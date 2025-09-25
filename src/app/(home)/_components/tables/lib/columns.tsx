"use client";

import type { LucideIcon } from "lucide-react";
import { Calendar, DollarSign, Hash, Store } from "lucide-react";

import { formatTokenAmount } from "@/lib/token";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@/trpc/client";
import { Seller } from "./seller";
import { cn, formatCompactAgo } from "@/lib/utils";

type ColumnType = RouterOutputs["sellers"]["list"]["all"]["items"][number];

export const columns: ColumnDef<ColumnType>[] = [
  {
    accessorKey: "recipient",
    header: () => (
      <HeaderCell Icon={Store} label="Seller" className="justify-start" />
    ),
    cell: ({ row }) => <Seller address={row.original.recipient} />,
    size: 300, // Fixed width for seller column (widest for address display)
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
