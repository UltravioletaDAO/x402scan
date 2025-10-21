import z from 'zod';
import type { Address } from 'viem';

import { ethereumAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';
import { baseQuerySchema, sortingSchema, applyBaseQueryDefaults } from '../lib';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';
import { normalizeAddresses, normalizeAddress } from '@/lib/utils';

const listFacilitatorTransfersSortIds = ['block_timestamp', 'amount'] as const;

export type TransfersSortId = (typeof listFacilitatorTransfersSortIds)[number];

export const listFacilitatorTransfersInputSchema = baseQuerySchema.extend({
  recipient: ethereumAddressSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: sortingSchema(listFacilitatorTransfersSortIds).default({
    id: 'block_timestamp',
    desc: true,
  }),
});

type TransferItem = {
  sender: Address;
  recipient: Address;
  amount: number;
  token_address: Address;
  transaction_from: Address;
  transaction_hash: string;
  block_timestamp: Date;
};

const listFacilitatorTransfersUncached = async (
  input: z.input<typeof listFacilitatorTransfersInputSchema>
) => {
  const parseResult = listFacilitatorTransfersInputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error('invalid input', input);
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const {
    recipient,
    startDate,
    endDate,
    limit,
    facilitators,
    tokens,
    sorting,
    chain,
  } = parsed;

  // Build the where clause for Prisma
  const where = {
    // Filter by chain
    chain: chain,
    // Filter by token addresses
    address: { in: normalizeAddresses(tokens, chain) },
    // Filter by facilitator addresses
    transaction_from: { in: normalizeAddresses(facilitators, chain) },
    // Optional recipient filter
    ...(recipient ? { recipient: normalizeAddress(recipient, chain) } : {}),
    // Date range filters
    ...(startDate && endDate
      ? { block_timestamp: { gte: startDate, lte: endDate } }
      : {}),
    ...(startDate && !endDate ? { block_timestamp: { gte: startDate } } : {}),
    ...(!startDate && endDate ? { block_timestamp: { lte: endDate } } : {}),
  };

  // Fetch transfers from Neon database
  const transfers = await transfersPrisma.transferEvent.findMany({
    where,
    orderBy: {
      [sorting.id]: sorting.desc ? 'desc' : 'asc',
    },
    take: limit + 1,
  });

  // Map to expected output format
  const items = transfers.map(
    (transfer): TransferItem => ({
      sender: transfer.sender as Address,
      recipient: transfer.recipient as Address,
      amount: transfer.amount,
      token_address: transfer.address as Address,
      transaction_from: transfer.transaction_from as Address,
      transaction_hash: transfer.tx_hash,
      block_timestamp: transfer.block_timestamp,
    })
  );

  return toPaginatedResponse({
    items,
    limit,
  });
};

export const listFacilitatorTransfers = createCachedPaginatedQuery({
  queryFn: listFacilitatorTransfersUncached,
  cacheKeyPrefix: 'transfers-list',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['block_timestamp'],

  tags: ['transfers'],
});
