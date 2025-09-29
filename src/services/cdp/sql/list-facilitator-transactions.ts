import z from 'zod';

import { runBaseSqlQuery } from './query';

import { ethereumAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';
import { formatDateForSql } from './lib';

export const listFacilitatorTransactionsInputSchema = z.object({
  recipient: ethereumAddressSchema.optional(),
  after: z
    .object({
      timestamp: z.date(),
      logIndex: z.number().optional(),
    })
    .optional(),
  limit: z.number().default(100),
});

const outputSchema = z.array(
  z.object({
    sender: ethereumAddressSchema,
    recipient: ethereumAddressSchema,
    amount: z.coerce.bigint(),
    token_address: ethereumAddressSchema,
    transaction_hash: z.string(),
    block_timestamp: z.coerce.date(),
    log_index: z.number(),
  })
);

export const listFacilitatorTransactions = async (
  input: z.input<typeof listFacilitatorTransactionsInputSchema>
) => {
  const parseResult = listFacilitatorTransactionsInputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error('invalid input', input);
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { recipient, after, limit } = parseResult.data;

  const sql = `SELECT
  parameters['from']::String AS sender,
  parameters['to']::String AS recipient,
  parameters['value']::UInt256 AS amount,
  transaction_from,
  address AS token_address,
  transaction_hash,
  block_timestamp,
  log_index
FROM base.events
WHERE event_signature = 'Transfer(address,address,uint256)'
  AND transaction_from in ('0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6')
  ${recipient ? `AND recipient = '${recipient}'` : ''}
  ${after ? `AND block_timestamp > '${formatDateForSql(after.timestamp)}'` : ''}
ORDER BY block_timestamp DESC
LIMIT ${limit + 1};`;
  const result = await runBaseSqlQuery(sql, outputSchema);

  return toPaginatedResponse({
    items: result ?? [],
    limit,
  });
};
