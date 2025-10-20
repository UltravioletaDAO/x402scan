import { facilitatorNameMap, facilitators } from '@/lib/facilitators';
import { sortingSchema } from '../lib';
import z from 'zod';
import { ethereumAddressSchema } from '@/lib/schemas';
import { USDC_ADDRESS } from '@/lib/utils';
import { createCachedArrayQuery, createStandardCacheKey } from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';

const listTopFacilitatorsSortIds = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
  'unique_sellers',
] as const;

export type FacilitatorsSortId = (typeof listTopFacilitatorsSortIds)[number];

export const listTopFacilitatorsInputSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: sortingSchema(listTopFacilitatorsSortIds).default({
    id: 'tx_count',
    desc: true,
  }),
  tokens: z.array(ethereumAddressSchema).default([USDC_ADDRESS]),
});

const listTopFacilitatorsUncached = async (
  input: z.input<typeof listTopFacilitatorsInputSchema>
) => {
  const { startDate, endDate, limit, sorting, tokens } =
    listTopFacilitatorsInputSchema.parse(input);

  // Build the where clause for Prisma
  const where = {
    // Filter by token addresses
    address: { in: tokens.map(t => t.toLowerCase()) },
    // Filter by known facilitator addresses only
    transaction_from: { 
      in: facilitators.flatMap(f => f.addresses.map(a => a.toLowerCase())) 
    },
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

  // Group by transaction_from (facilitator address)
  const grouped = await transfersPrisma.transferEvent.groupBy({
    by: ['transaction_from'],
    where,
    _count: true,
    _sum: { amount: true },
    _max: { block_timestamp: true },
  });

  // For each facilitator, get unique buyers and sellers
  const results = await Promise.all(
    grouped.map(async (group) => {
      const facilitatorWhere = { ...where, transaction_from: group.transaction_from };
      
      const [uniqueBuyers, uniqueSellers] = await Promise.all([
        transfersPrisma.transferEvent.groupBy({
          by: ['sender'],
          where: facilitatorWhere,
        }),
        transfersPrisma.transferEvent.groupBy({
          by: ['recipient'],
          where: facilitatorWhere,
        }),
      ]);

      // Map address to facilitator name
      const facilitator = facilitators.find(f => 
        f.addresses.some(addr => addr.toLowerCase() === group.transaction_from.toLowerCase())
      );

      return {
        facilitator_name: facilitator?.name ?? ('Unknown' as const),
        facilitator: facilitator ?? facilitatorNameMap.get('Coinbase')!,
        tx_count: group._count,
        total_amount: group._sum.amount ?? 0,
        latest_block_timestamp: group._max.block_timestamp ?? new Date(),
        unique_buyers: uniqueBuyers.length,
        unique_sellers: uniqueSellers.length,
      };
    })
  );

  // Sort results
  type SortableResult = typeof results[number];
  const sortKey = sorting.id as keyof SortableResult;
  results.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return sorting.desc ? -comparison : comparison;
  });

  // Return limited results
  return results.slice(0, limit);
};

export const listTopFacilitators = createCachedArrayQuery({
  queryFn: listTopFacilitatorsUncached,
  cacheKeyPrefix: 'facilitators-list',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['latest_block_timestamp'],

  tags: ['facilitators'],
});
