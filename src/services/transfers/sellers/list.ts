import z from 'zod';
import { Prisma } from '@prisma/client';

import { chainSchema, mixedAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';

import { baseListQuerySchema } from '../schemas';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { queryRaw } from '@/services/transfers/client';
import { paginationClause, transfersWhereClause } from '../query-utils';

import type { paginatedQuerySchema } from '@/lib/pagination';

export const SELLERS_SORT_IDS = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
] as const;

export type SellerSortId = (typeof SELLERS_SORT_IDS)[number];

export const listTopSellersInputSchema = baseListQuerySchema({
  sortIds: SELLERS_SORT_IDS,
  defaultSortId: 'tx_count',
});

const listTopSellersUncached = async (
  input: z.infer<typeof listTopSellersInputSchema>,
  pagination: z.infer<typeof paginatedQuerySchema>
) => {
  const { sorting } = input;

  const orderByMap: Record<SellerSortId, string> = {
    tx_count: 'tx_count',
    total_amount: 'total_amount',
    latest_block_timestamp: 'latest_block_timestamp',
    unique_buyers: 'unique_buyers',
  };
  const orderByField = orderByMap[sorting.id];
  const orderDirection = sorting.desc ? 'DESC' : 'ASC';

  const sql = Prisma.sql`
    SELECT 
      recipient,
      ARRAY_AGG(DISTINCT facilitator_id) as facilitator_ids,
      COUNT(*) as tx_count,
      SUM(amount) as total_amount,
      MAX(block_timestamp) as latest_block_timestamp,
      COUNT(DISTINCT sender) as unique_buyers,
      ARRAY_AGG(DISTINCT chain) as chains
    FROM "TransferEvent"
    ${transfersWhereClause(input)}
    GROUP BY recipient
    ORDER BY ${Prisma.raw(orderByField)} ${Prisma.raw(orderDirection)}
    ${paginationClause(pagination)}
  `;

  const items = await queryRaw(
    sql,
    z.array(
      z.object({
        recipient: mixedAddressSchema,
        facilitator_ids: z.array(z.string()),
        tx_count: z.number(),
        total_amount: z.number(),
        latest_block_timestamp: z.date(),
        unique_buyers: z.number(),
        chains: z.array(chainSchema),
      })
    )
  );

  return toPaginatedResponse({
    items,
    page_size: pagination.page_size,
  });
};

export const listTopSellers = createCachedPaginatedQuery({
  queryFn: listTopSellersUncached,
  cacheKeyPrefix: 'sellers-list',
  createCacheKey: createStandardCacheKey,
  dateFields: ['latest_block_timestamp'],
  tags: ['sellers'],
});
