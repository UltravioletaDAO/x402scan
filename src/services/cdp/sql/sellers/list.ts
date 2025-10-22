import z from 'zod';
import type { Address } from 'viem';
import { Prisma } from '@prisma/client';

import { ethereumAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';

import type { infiniteQuerySchema } from '@/lib/pagination';
import { baseQuerySchema, sortingSchema, applyBaseQueryDefaults } from '../lib';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';
import { normalizeAddresses } from '@/lib/utils';

const sellerSortIds = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
] as const;

export type SellerSortId = (typeof sellerSortIds)[number];

export const listTopSellersInputSchema = baseQuerySchema.extend({
  sorting: sortingSchema(sellerSortIds),
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type TopSellerItem = {
  recipient: Address;
  facilitators: Address[];
  tx_count: number;
  total_amount: number;
  latest_block_timestamp: Date;
  unique_buyers: number;
};

const listTopSellersUncached = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const parseResult = listTopSellersInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const {
    sorting,
    addresses,
    startDate,
    endDate,
    facilitators,
    tokens,
    chain,
  } = parsed;
  const { limit } = pagination;

  const normalizedTokens = normalizeAddresses(tokens, chain);
  const normalizedFacilitators = normalizeAddresses(facilitators, chain);
  const normalizedAddresses = addresses && addresses.length > 0 
    ? normalizeAddresses(addresses, chain) 
    : null;

  const orderByMap: Record<SellerSortId, string> = {
    tx_count: 'tx_count',
    total_amount: 'total_amount',
    latest_block_timestamp: 'latest_block_timestamp',
    unique_buyers: 'unique_buyers',
  };
  const orderByField = orderByMap[sorting.id as SellerSortId];
  const orderDirection = sorting.desc ? 'DESC' : 'ASC';

  const results = await transfersPrisma.$queryRaw<
    Array<{
      recipient: string;
      facilitators: string[];
      tx_count: bigint;
      total_amount: bigint;
      latest_block_timestamp: Date;
      unique_buyers: bigint;
    }>
  >(
    Prisma.sql`
      SELECT 
        recipient,
        ARRAY_AGG(DISTINCT transaction_from) as facilitators,
        COUNT(*) as tx_count,
        SUM(amount) as total_amount,
        MAX(block_timestamp) as latest_block_timestamp,
        COUNT(DISTINCT sender) as unique_buyers
      FROM "TransferEvent"
      WHERE chain = ${chain}
        AND address = ANY(${normalizedTokens})
        AND transaction_from = ANY(${normalizedFacilitators})
        ${normalizedAddresses ? Prisma.sql`AND recipient = ANY(${normalizedAddresses})` : Prisma.empty}
        ${startDate ? Prisma.sql`AND block_timestamp >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND block_timestamp <= ${endDate}` : Prisma.empty}
      GROUP BY recipient
      ORDER BY ${Prisma.raw(orderByField)} ${Prisma.raw(orderDirection)}
      LIMIT ${limit + 1}
    `
  );

  const formattedResults: TopSellerItem[] = results.map(row => ({
    recipient: row.recipient as Address,
    facilitators: row.facilitators as Address[],
    tx_count: Number(row.tx_count),
    total_amount: Number(row.total_amount),
    latest_block_timestamp: row.latest_block_timestamp,
    unique_buyers: Number(row.unique_buyers),
  }));

  return toPaginatedResponse({
    items: formattedResults,
    limit,
  });
};

const _listTopSellersCached = createCachedPaginatedQuery({
  queryFn: ({
    input,
    pagination,
  }: {
    input: z.input<typeof listTopSellersInputSchema>;
    pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>;
  }) => listTopSellersUncached(input, pagination),
  cacheKeyPrefix: 'sellers-list',
  createCacheKey: ({ input, pagination }) =>
    createStandardCacheKey({ ...input, limit: pagination.limit }),
  dateFields: ['latest_block_timestamp'],

  tags: ['sellers'],
});

export const listTopSellers = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => _listTopSellersCached({ input, pagination });
