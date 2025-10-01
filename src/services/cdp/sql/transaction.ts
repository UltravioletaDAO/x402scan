import z from 'zod';
import { runBaseSqlQuery } from './query';

export const getTransaction = async (input: string) => {
  const sql = `SELECT * FROM base.transactions WHERE transaction_hash = '${input}' LIMIT 1`;
  const result = await runBaseSqlQuery(
    sql,
    z.array(z.object({ block_timestamp: z.string() }))
  );
  return result;
};
