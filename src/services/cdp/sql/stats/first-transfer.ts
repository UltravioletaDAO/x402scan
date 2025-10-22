import z from 'zod';
import { Prisma } from '@prisma/client';

import { baseQuerySchema, applyBaseQueryDefaults } from '../lib';

import { mixedAddressSchema } from '@/lib/schemas';
import { queryRaw } from '@/services/db/transfers-client';
import { normalizeAddresses } from '@/lib/utils';

export const getFirstTransferTimestampInputSchema = baseQuerySchema.extend({
  addresses: z.array(mixedAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const firstTransferResultSchema = z.array(
  z.object({
    block_timestamp: z.date(),
  })
);

export const getFirstTransferTimestamp = async (
  input: z.input<typeof getFirstTransferTimestampInputSchema>
): Promise<Date | null> => {
  const parseResult = getFirstTransferTimestampInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const { addresses, startDate, endDate, facilitators, tokens, chain } = parsed;

  const normalizedTokens = normalizeAddresses(tokens, chain);
  const normalizedFacilitators = normalizeAddresses(facilitators, chain);
  const normalizedAddresses = addresses && normalizeAddresses(addresses, chain);

  const recipientFilter =
    normalizedAddresses && normalizedAddresses.length > 0
      ? Prisma.sql`AND t.recipient = ANY(${normalizedAddresses}::text[])`
      : Prisma.empty;

  const dateFilter =
    startDate && endDate
      ? Prisma.sql`AND t.block_timestamp >= ${startDate} AND t.block_timestamp <= ${endDate}`
      : startDate
        ? Prisma.sql`AND t.block_timestamp >= ${startDate}`
        : endDate
          ? Prisma.sql`AND t.block_timestamp <= ${endDate}`
          : Prisma.empty;

  const sql = Prisma.sql`
    SELECT t.block_timestamp
    FROM "TransferEvent" t
    WHERE t.chain = ${chain}
      AND t.address = ANY(${normalizedTokens}::text[])
      AND t.transaction_from = ANY(${normalizedFacilitators}::text[])
      ${recipientFilter}
      ${dateFilter}
    ORDER BY t.block_timestamp ASC
    LIMIT 1
  `;

  const result = await queryRaw(sql, firstTransferResultSchema);

  return result[0]?.block_timestamp ?? null;
};
