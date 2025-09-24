"use client";

import { Hash, Store } from "lucide-react";

import { format, formatDistanceToNow, formatRelative } from "date-fns";

import { Address } from "@/components/address";

import { formatTokenAmount } from "@/lib/token";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@/trpc/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<
  RouterOutputs["sellers"]["list"]["items"][number]
>[] = [
  {
    accessorKey: "recipient",
    header: () => (
      <div className="flex items-center gap-2 text-sm">
        <Store className="size-4" />
        Seller
      </div>
    ),
    cell: ({ row }) => <Address address={row.original.recipient} />,
  },
  {
    accessorKey: "tx_count",
    header: () => (
      <div className="flex items-center justify-center gap-2 text-sm">
        <Hash className="size-4" />
        Tx Count
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {row.original.tx_count.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "latest_block_timestamp",
    header: () => <div className="text-center text-sm">Latest Transaction</div>,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {formatDistanceToNow(row.original.latest_block_timestamp, {
          addSuffix: true,
        })}
      </div>
    ),
  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right text-sm">Total Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono font-semibold text-xs">
        {formatTokenAmount(row.original.total_amount)}
      </div>
    ),
  },
];
