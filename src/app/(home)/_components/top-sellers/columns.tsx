"use client";

import { Address } from "@/components/address";
import { formatTokenAmount } from "@/lib/token";
import { RouterOutputs } from "@/trpc/client";
import { ColumnDef } from "@tanstack/react-table";
import { Hash, Store } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<
  RouterOutputs["sellers"]["list"]["items"][number]
>[] = [
  {
    accessorKey: "recipient",
    header: () => (
      <div className="flex items-center gap-2">
        <Store className="size-4" />
        Seller
      </div>
    ),
    cell: ({ row }) => <Address address={row.original.recipient} />,
  },
  {
    accessorKey: "tx_count",
    header: () => (
      <div className="flex items-center justify-center gap-2">
        <Hash className="size-4" />
        Tx Count
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.tx_count.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {formatTokenAmount(row.original.total_amount)}
      </div>
    ),
  },
];
