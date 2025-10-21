import {
  facilitatorNameMap,
  facilitators,
  type Facilitator,
} from '@/lib/facilitators';
import { sortingSchema } from '../lib';
import z from 'zod';
import { mixedAddressSchema } from '@/lib/schemas';
import { getUSDCAddress } from '@/lib/utils';
import { createCachedArrayQuery, createStandardCacheKey } from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';
import { Chain, DEFAULT_CHAIN, SUPPORTED_CHAINS } from '@/types/chain';

const listTopFacilitatorsSortIds = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
  'unique_sellers',
] as const;

export type FacilitatorsSortId = (typeof listTopFacilitatorsSortIds)[number];

export const listTopFacilitatorsInputSchema = z.object({
  chain: z.enum(SUPPORTED_CHAINS).default(DEFAULT_CHAIN),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: sortingSchema(listTopFacilitatorsSortIds).default({
    id: 'tx_count',
    desc: true,
  }),
  tokens: z.array(mixedAddressSchema).optional(),
});

export type FacilitatorItem = {
  facilitator_name: string;
  facilitator: Facilitator;
  tx_count: number;
  total_amount: number;
  latest_block_timestamp: Date;
  unique_buyers: number;
  unique_sellers: number;
};

const listTopFacilitatorsUncached = async (
  input: z.input<typeof listTopFacilitatorsInputSchema>
) => {
  const parsed = listTopFacilitatorsInputSchema.parse(input);
  const { startDate, endDate, limit, sorting, chain } = parsed;

  const chainFacilitators = facilitators.filter(f => f.chain === chain);

  // Build the where clause for Prisma
  const where = {
    // Filter by chain
    chain: chain,
    // Filter by token addresses
    address: {
      in: getUSDCAddress(chain),
    },
    // Filter by known facilitator addresses only
    transaction_from: {
      in: chainFacilitators.flatMap(f =>
        // Only lowercase for non-Solana chains
        chain === Chain.SOLANA
          ? f.addresses
          : f.addresses.map(a => a.toLowerCase())
      ),
    },
    // Date range filters
    ...(startDate &&
      endDate && {
        block_timestamp: { gte: startDate, lte: endDate },
      }),
    ...(startDate &&
      !endDate && {
        block_timestamp: { gte: startDate },
      }),
    ...(!startDate &&
      endDate && {
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
    grouped.map(async group => {
      const facilitatorWhere = {
        ...where,
        transaction_from: group.transaction_from,
      };

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
      const facilitator = chainFacilitators.find(f =>
        f.addresses.some(addr =>
          chain === Chain.SOLANA
            ? addr === group.transaction_from
            : addr.toLowerCase() === group.transaction_from.toLowerCase()
        )
      );

      return {
        facilitator_name: facilitator?.name ?? ('Unknown' as const),
        facilitator: facilitator ?? facilitatorNameMap.get('Coinbase')!,
        tx_count: group._count,
        total_amount: group._sum.amount ?? 0,
        latest_block_timestamp: group._max.block_timestamp ?? new Date(),
        unique_buyers: uniqueBuyers.length,
        unique_sellers: uniqueSellers.length,
      } satisfies FacilitatorItem;
    })
  );

  // Sort results
  type SortableResult = (typeof results)[number];
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
