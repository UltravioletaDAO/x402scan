import {
  facilitatorNameMap,
  facilitators,
  type Facilitator,
} from '@/lib/facilitators';
import { sortingSchema } from '../lib';
import z from 'zod';
import { mixedAddressSchema } from '@/lib/schemas';
import { createCachedArrayQuery, createStandardCacheKey } from '@/lib/cache';
import { queryRaw } from '@/services/db/transfers-client';
import { Chain, DEFAULT_CHAIN, SUPPORTED_CHAINS } from '@/types/chain';
import { Prisma } from '@prisma/client';

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

type FacilitatorItem = {
  facilitator_name: string;
  facilitator: Facilitator;
  tx_count: number;
  total_amount: number;
  latest_block_timestamp: Date;
  unique_buyers: number;
  unique_sellers: number;
};

const facilitatorRowSchema = z.object({
  transaction_from: z.string(),
  tx_count: z.number(),
  total_amount: z.number(),
  latest_block_timestamp: z.date(),
  unique_buyers: z.number(),
  unique_sellers: z.number(),
});

const facilitatorResultSchema = z.array(facilitatorRowSchema);

const listTopFacilitatorsUncached = async (
  input: z.input<typeof listTopFacilitatorsInputSchema>
) => {
  const parsed = listTopFacilitatorsInputSchema.parse(input);
  const { startDate, endDate, limit, sorting, chain } = parsed;

  const chainFacilitators = chain
    ? facilitators.filter(f => f.addresses[chain] !== undefined)
    : facilitators;

  const facilitatorAddresses = chainFacilitators.flatMap(
    f => f.addresses[chain]
  );

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
    SELECT 
      t.transaction_from,
      COUNT(*)::int AS tx_count,
      SUM(t.amount)::float AS total_amount,
      MAX(t.block_timestamp) AS latest_block_timestamp,
      COUNT(DISTINCT t.sender)::int AS unique_buyers,
      COUNT(DISTINCT t.recipient)::int AS unique_sellers
    FROM "TransferEvent" t
    WHERE 1=1
      ${chain ? Prisma.sql`AND t.chain = ${chain}` : Prisma.empty}
      ${facilitatorAddresses.length > 0 ? Prisma.sql`AND t.transaction_from = ANY(${facilitatorAddresses}::text[])` : Prisma.empty}
      ${startDate ? Prisma.sql`AND t.block_timestamp >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND t.block_timestamp <= ${endDate}` : Prisma.empty}
    GROUP BY t.transaction_from
    ORDER BY ${Prisma.raw(sortColumn)} ${sortDirection}
    LIMIT ${limit}
  `;

  const rawResult = await queryRaw(sql, facilitatorResultSchema);

  // Map results to include facilitator objects
  const results: FacilitatorItem[] = rawResult.map(row => {
    const facilitator = chainFacilitators.find(f =>
      f.addresses[chain]?.some(addr =>
        chain === Chain.SOLANA
          ? addr === row.transaction_from
          : addr.toLowerCase() === row.transaction_from.toLowerCase()
      )
    );

    return {
      facilitator_name: facilitator?.name ?? ('Unknown' as const),
      facilitator: facilitator ?? facilitatorNameMap.get('Coinbase')!,
      tx_count: row.tx_count,
      total_amount:
        typeof row.total_amount === 'number'
          ? row.total_amount
          : Number(row.total_amount),
      latest_block_timestamp: row.latest_block_timestamp,
      unique_buyers: row.unique_buyers,
      unique_sellers: row.unique_sellers,
    };
  });

  return results;
};

export const listTopFacilitators = createCachedArrayQuery({
  queryFn: listTopFacilitatorsUncached,
  cacheKeyPrefix: 'facilitators-list',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['latest_block_timestamp'],

  tags: ['facilitators'],
});
