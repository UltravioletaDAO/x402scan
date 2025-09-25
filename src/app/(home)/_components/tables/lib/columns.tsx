"use client";

import { DollarSign, Hash, Store } from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import { formatTokenAmount } from "@/lib/token";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@/trpc/client";
import { Seller } from "./seller";

type ColumnType = RouterOutputs["sellers"]["list"]["all"]["items"][number];

export const columns: ColumnDef<ColumnType>[] = [
  {
    accessorKey: "recipient",
    header: () => (
      <div className="flex items-center gap-2 text-sm">
        <Store className="size-4" />
        Seller
      </div>
    ),
    cell: ({ row }) => <Seller address={row.original.recipient} />,
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
    header: () => (
      <div className="flex items-center justify-center gap-2 text-sm">
        <Hash className="size-4" />
        Latest Transaction
      </div>
    ),
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
    header: () => (
      <div className="flex items-center justify-end gap-2 text-sm">
        <DollarSign className="size-4" />
        Total Amount
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono font-semibold text-xs">
        {formatTokenAmount(row.original.total_amount)}
      </div>
    ),
  },
];
