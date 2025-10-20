import z from 'zod';

import { baseQuerySchema } from '../lib';

import { ethereumAddressSchema } from '@/lib/schemas';
import { transfersPrisma } from '@/services/db/transfers-client';

export const getFirstTransferTimestampInputSchema = baseQuerySchema.extend({
  addresses: z.array(ethereumAddressSchema).optional(),
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
  const { addresses, startDate, endDate, facilitators, tokens } =
    parseResult.data;

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

  // Get the first transfer (earliest timestamp)
  const firstTransfer = await transfersPrisma.transferEvent.findFirst({
    where,
    orderBy: { block_timestamp: 'asc' },
    select: { block_timestamp: true },
  });

  return firstTransfer?.block_timestamp ?? null;
};
