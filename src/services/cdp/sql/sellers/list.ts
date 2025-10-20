import z from 'zod';

import { ethereumAddressSchema, facilitatorAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';

import type { infiniteQuerySchema } from '@/lib/pagination';
import { baseQuerySchema, sortingSchema } from '../lib';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';

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

const listTopSellersUncached = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const parseResult = listTopSellersInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { sorting, addresses, startDate, endDate, facilitators, tokens } =
    parseResult.data;
  const { limit } = pagination;

  // Build the where clause for Prisma
  const where = {
    // Filter by token addresses
    address: { in: tokens.map(t => t.toLowerCase()) },
    // Filter by facilitator addresses
    transaction_from: { in: facilitators.map(f => f.toLowerCase()) },
    // Optional filter by recipient addresses (sellers)
    ...(addresses && addresses.length > 0 && {
      recipient: { in: addresses.map(a => a.toLowerCase()) },
    }),
    // Date range filters
    ...(startDate && endDate && {
      block_timestamp: { gte: startDate, lte: endDate },
    }),
    ...(startDate && !endDate && {
      block_timestamp: { gte: startDate },
    }),
    ...(!startDate && endDate && {
      block_timestamp: { lte: endDate },
    }),
  };

  // Group by recipient
  const grouped = await transfersPrisma.transferEvent.groupBy({
    by: ['recipient'],
    where,
    _count: true,
    _sum: { amount: true },
    _max: { block_timestamp: true },
  });

  // For each seller, get unique buyers and facilitators
  const results = await Promise.all(
    grouped.map(async (group) => {
      const sellerWhere = { ...where, recipient: group.recipient };
      
      const [uniqueBuyers, facilitatorsList] = await Promise.all([
        transfersPrisma.transferEvent.groupBy({
          by: ['sender'],
          where: sellerWhere,
        }),
        transfersPrisma.transferEvent.groupBy({
          by: ['transaction_from'],
          where: sellerWhere,
        }),
      ]);

      return {
        recipient: group.recipient,
        facilitators: facilitatorsList.map(f => f.transaction_from),
        tx_count: group._count,
        total_amount: group._sum.amount ?? 0,
        latest_block_timestamp: group._max.block_timestamp ?? new Date(),
        unique_buyers: uniqueBuyers.length,
      };
    })
  );

  // Sort results in TypeScript
  type SortableResult = typeof results[number];
  const sortKey = sorting.id as keyof SortableResult;
  results.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return sorting.desc ? -comparison : comparison;
  });

  // Return paginated response
  return toPaginatedResponse({
    items: results.slice(0, limit + 1),
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
