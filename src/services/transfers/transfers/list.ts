import type z from 'zod';

import {
  toPaginatedResponse,
  type paginatedQuerySchema,
} from '@/lib/pagination';
import { baseListQuerySchema } from '../schemas';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { transfersPrisma } from '@/services/transfers/client';
import type { MixedAddress } from '@/types/address';
import type { Chain } from '@/types/chain';

export const TRANSFERS_SORT_IDS = ['block_timestamp', 'amount'] as const;
export type TransfersSortId = (typeof TRANSFERS_SORT_IDS)[number];

export const listFacilitatorTransfersInputSchema = baseListQuerySchema({
  sortIds: TRANSFERS_SORT_IDS,
  defaultSortId: 'block_timestamp',
});

const listFacilitatorTransfersUncached = async (
  input: z.infer<typeof listFacilitatorTransfersInputSchema>,
  pagination: z.infer<typeof paginatedQuerySchema>
) => {
  const { recipients, startDate, endDate, facilitatorIds, sorting, chain } =
    input;
  const { page_size: limit, page } = pagination;

  // Fetch transfers from Neon database
  const transfers = await transfersPrisma.transferEvent.findMany({
    where: {
      ...(chain ? { chain } : {}),
      ...(facilitatorIds ? { facilitator_id: { in: facilitatorIds } } : {}),
      ...(recipients?.include ? { recipient: { in: recipients.include } } : {}),
      ...(recipients?.exclude
        ? { recipient: { notIn: recipients.exclude } }
        : {}),
      ...(startDate || endDate
        ? { block_timestamp: { gte: startDate, lte: endDate } }
        : {}),
    },
    orderBy: {
      [sorting.id]: sorting.desc ? 'desc' : 'asc',
    },
    take: limit + 1,
    skip: page * limit,
  });

  // Map to expected output format
  const items = transfers.map(transfer => ({
    ...transfer,
    sender: transfer.sender as MixedAddress,
    recipient: transfer.recipient as MixedAddress,
    token_address: transfer.address as MixedAddress,
    transaction_from: transfer.transaction_from as MixedAddress,
    chain: transfer.chain as Chain,
  }));

  return toPaginatedResponse({
    items,
    page_size: pagination.page_size,
  });
};

export const listFacilitatorTransfers = createCachedPaginatedQuery({
  queryFn: listFacilitatorTransfersUncached,
  cacheKeyPrefix: 'transfers-list',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['block_timestamp'],
  tags: ['transfers'],
});
