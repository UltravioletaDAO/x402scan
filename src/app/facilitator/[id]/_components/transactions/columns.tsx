'use client';

import { Calendar, DollarSign, Hash, Server, User } from 'lucide-react';

import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';

import { HeaderCell } from '@/components/ui/data-table/header-cell';

import { Address } from '@/components/ui/address';

import { formatCompactAgo } from '@/lib/utils';
import { formatTokenAmount } from '@/lib/token';

import type { ExtendedColumnDef } from '@/components/ui/data-table';
import type { RouterOutputs } from '@/trpc/client';
import { Seller, SellerSkeleton } from '@/app/_components/seller';

type ColumnType = RouterOutputs['transfers']['list']['items'][number];

export const columns: ExtendedColumnDef<ColumnType>[] = [
  {
    accessorKey: 'recipient',
    header: () => (
      <HeaderCell Icon={Server} label="Server" className="justify-start" />
    ),
    cell: ({ row }) => (
      <Seller
        address={row.original.recipient}
        addressClassName="text-xs font-normal"
      />
    ),
    size: 300, // Fixed width for seller column (widest for address display)
    loading: () => <SellerSkeleton />,
  },
  {
    accessorKey: 'sender',
    header: () => (
      <HeaderCell Icon={User} label="Sender" className="justify-center" />
    ),
    cell: ({ row }) => (
      <Address
        address={row.original.sender}
        className="text-xs block text-center"
      />
    ),
    size: 300,
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: 'transaction_hash',
    header: () => (
      <HeaderCell Icon={Hash} label="Hash" className="justify-center" />
    ),
    cell: ({ row }) => (
      <Link href={`/transaction/${row.original.transaction_hash}`}>
        <Address
          address={row.original.transaction_hash}
          className="text-xs block text-center"
          disableCopy
          hideTooltip
        />
      </Link>
    ),
    size: 300,
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: 'amount',
    header: () => <HeaderCell Icon={DollarSign} label="Amount" />,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs">
        {formatTokenAmount(row.original.amount)}
      </div>
    ),
    size: 100, // Fixed width for buyers count
    loading: () => <Skeleton className="h-4 w-16 mx-auto" />,
  },
  {
    accessorKey: 'block_timestamp',
    header: () => (
      <HeaderCell Icon={Calendar} label="Timestamp" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs">
        {formatCompactAgo(row.original.block_timestamp)}
      </div>
    ),
    size: 100,
    loading: () => <Skeleton className="h-4 w-16 ml-auto" />,
  },
];
