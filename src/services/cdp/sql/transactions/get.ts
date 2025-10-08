import z from 'zod';
import { runBaseSqlQuery } from '../query';
import {
  ethereumAddressSchema,
  ethereumHashSchema,
  facilitatorAddressSchema,
} from '@/lib/schemas';
import { baseQuerySchema } from '../lib';

export const getTransactionInputSchema = baseQuerySchema.extend({
  transaction_hash: ethereumHashSchema,
});

const outputSchema = z.object({
  block_number: z.coerce.bigint(),
  timestamp: z.coerce.date(),
  transaction_hash: ethereumHashSchema,
  transaction_index: z.coerce.bigint(),
  from_address: facilitatorAddressSchema,
  to_address: ethereumAddressSchema,
  gas: z.coerce.bigint(),
  gas_price: z.coerce.bigint(),
});

export const getTransaction = async (
  input: z.input<typeof getTransactionInputSchema>
) => {
  const parseResult = getTransactionInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { transaction_hash, facilitators } = parseResult.data;

  const sql = `SELECT 
  block_number,
  timestamp,
  transaction_hash,
  transaction_index,
  from_address,
  to_address,
  gas,
  gas_price
FROM base.transactions 
WHERE 
    transaction_hash = '${transaction_hash}'
    AND from_address IN (${facilitators.map(f => `'${f}'`).join(', ')})
LIMIT 1`;
  const result = await runBaseSqlQuery(sql, z.array(outputSchema));
  return result ? result[0] : null;
};
