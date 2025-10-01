import z from 'zod';
import { runBaseSqlQuery } from './query';
import { ethereumAddressSchema } from '@/lib/schemas';

export const getTransaction = async (input: string) => {
  const outputSchema = z.object({
    block_number: z.coerce.bigint(),
    timestamp: z.coerce.date(),
    transaction_hash: z.string(),
    transaction_index: z.coerce.bigint(),
    from_address: ethereumAddressSchema,
    to_address: ethereumAddressSchema,
    gas: z.coerce.bigint(),
    gas_price: z.coerce.bigint(),
  });

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
    transaction_hash = '${input}'
    AND from_address IN (
        '0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', 
        '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'
    )
LIMIT 1`;
  const result = await runBaseSqlQuery(sql, z.array(outputSchema));
  return result ? result[0] : null;
};
