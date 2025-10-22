import z from 'zod';

import { baseQuerySchema, applyBaseQueryDefaults } from '../lib';

import { mixedAddressSchema } from '@/lib/schemas';
import { transfersPrisma } from '@/services/db/transfers-client';
import { normalizeAddresses } from '@/lib/utils';

export const getFirstTransferTimestampInputSchema = baseQuerySchema.extend({
  addresses: z.array(mixedAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getFirstTransferTimestamp = async (
  input: z.input<typeof getFirstTransferTimestampInputSchema>
): Promise<Date | null> => {
  const parseResult = getFirstTransferTimestampInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const { addresses, startDate, endDate, facilitators, tokens, chain } = parsed;

  // Build the where clause for Prisma
  const where = {
    // Filter by chain
    chain: chain,
    // Filter by token addresses
    address: { in: normalizeAddresses(tokens, chain) },
    // Filter by facilitator addresses
    transaction_from: { in: normalizeAddresses(facilitators, chain) },
    // Optional filter by recipient addresses (sellers)
    ...(addresses && addresses.length > 0
      ? { recipient: { in: normalizeAddresses(addresses, chain) } }
      : {}),
    // Date range filters
    ...(startDate && endDate
      ? { block_timestamp: { gte: startDate, lte: endDate } }
      : {}),
    ...(startDate && !endDate ? { block_timestamp: { gte: startDate } } : {}),
    ...(!startDate && endDate ? { block_timestamp: { lte: endDate } } : {}),
  };

  // Get the first transfer (earliest timestamp)
  const firstTransfer = await transfersPrisma.transferEvent.findFirst({
    where,
    orderBy: { block_timestamp: 'asc' },
    select: { block_timestamp: true },
  });

  return firstTransfer?.block_timestamp ?? null;
};
