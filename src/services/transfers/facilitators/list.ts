import z from 'zod';

import { baseQuerySchema, sortingSchema } from '../lib';

import { queryRaw } from '@/services/db/transfers-client';

import { chainSchema, mixedAddressSchema } from '@/lib/schemas';
import { createCachedArrayQuery, createStandardCacheKey } from '@/lib/cache';

import { Prisma } from '@prisma/client';
import { facilitatorIdMap } from '@/lib/facilitators';

const listTopFacilitatorsSortIds = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
  'unique_sellers',
] as const;

export type FacilitatorsSortId = (typeof listTopFacilitatorsSortIds)[number];

export const listTopFacilitatorsInputSchema = baseQuerySchema.extend({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: sortingSchema(listTopFacilitatorsSortIds).default({
    id: 'tx_count',
    desc: true,
  }),
});

const listTopFacilitatorsUncached = async (
  input: z.input<typeof listTopFacilitatorsInputSchema>
) => {
  const parsed = listTopFacilitatorsInputSchema.parse(input);
  const { startDate, endDate, limit, sorting, chain } = parsed;

  const sortColumnMap: Record<FacilitatorsSortId, string> = {
    tx_count: 'tx_count',
    total_amount: 'total_amount',
    latest_block_timestamp: 'latest_block_timestamp',
    unique_buyers: 'unique_buyers',
    unique_sellers: 'unique_sellers',
  };
  const sortColumn = sortColumnMap[sorting.id as FacilitatorsSortId];
  const sortDirection = Prisma.raw(sorting.desc ? 'DESC' : 'ASC');

  const sql = Prisma.sql`
    WITH facilitators_expanded AS (
      SELECT
        f.id AS facilitator_id,
        f.addresses AS facilitator_addresses,
        unnest(f.addresses) AS facilitator_address
      FROM "Facilitator" f
    ),
    transfers_with_facilitator AS (
      SELECT
        t.*,
        fe.facilitator_id,
        fe.facilitator_addresses
      FROM "TransferEvent" t
      JOIN facilitators_expanded fe
        ON t.transaction_from = fe.facilitator_address
    )
    SELECT
      twf.facilitator_id,
      twf.facilitator_addresses,
      COUNT(*)::int AS tx_count,
      SUM(twf.amount)::float AS total_amount,
      MAX(twf.block_timestamp) AS latest_block_timestamp,
      COUNT(DISTINCT twf.sender)::int AS unique_buyers,
      COUNT(DISTINCT twf.recipient)::int AS unique_sellers,
      ARRAY_AGG(DISTINCT twf.chain) as chains
    FROM transfers_with_facilitator twf
    WHERE 1=1
      ${chain ? Prisma.sql`AND twf.chain = ${chain}` : Prisma.empty}
      ${startDate ? Prisma.sql`AND twf.block_timestamp >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND twf.block_timestamp <= ${endDate}` : Prisma.empty}
    GROUP BY twf.facilitator_id
    ORDER BY ${Prisma.raw(sortColumn)} ${sortDirection}
    LIMIT ${limit}
  `;

  const results = await queryRaw(
    sql,
    z.array(
      z.object({
        facilitator_id: z.string(),
        facilitator_addresses: z.array(mixedAddressSchema),
        tx_count: z.number(),
        total_amount: z.number(),
        latest_block_timestamp: z.date(),
        unique_buyers: z.number(),
        unique_sellers: z.number(),
        chains: z.array(chainSchema),
      })
    )
  );

  return results.map(result => ({
    ...result,
    facilitator: facilitatorIdMap.get(result.facilitator_id)!,
  }));
};

export const listTopFacilitators = createCachedArrayQuery({
  queryFn: listTopFacilitatorsUncached,
  cacheKeyPrefix: 'facilitators-list',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['latest_block_timestamp'],

  tags: ['facilitators'],
});
