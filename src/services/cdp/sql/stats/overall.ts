import z from 'zod';

import { runBaseSqlQuery } from '../query';

import { ethereumAddressSchema } from '@/lib/schemas';
import { baseQuerySchema, formatDateForSql } from '../lib';

export const overallStatisticsInputSchema = baseQuerySchema.extend({
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const getOverallStatistics = async (
  input: z.input<typeof overallStatisticsInputSchema>
) => {
  const parseResult = overallStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { addresses, startDate, endDate, facilitators, tokens } =
    parseResult.data;
  const outputSchema = z.object({
    total_transactions: z.coerce.bigint(),
    total_amount: z.coerce.bigint(),
    unique_buyers: z.coerce.bigint(),
    unique_sellers: z.coerce.bigint(),
    latest_block_timestamp: z.coerce.date(),
  });

  const sql = `SELECT 
    COUNT(*) AS total_transactions,
    SUM(parameters['value']::UInt256) AS total_amount,
    COUNT(DISTINCT parameters['from']::String) AS unique_buyers,
    COUNT(DISTINCT parameters['to']::String) AS unique_sellers,
    max(block_timestamp) AS latest_block_timestamp
FROM base.events 
WHERE event_signature = 'Transfer(address,address,uint256)'
    AND address IN (${tokens.map(t => `'${t}'`).join(', ')})
    AND transaction_from IN (${facilitators.map(f => `'${f}'`).join(', ')})
    ${
      addresses
        ? `AND parameters['to']::String IN (${addresses
            .map(a => `'${a}'`)
            .join(', ')})`
        : ''
    }
    ${
      startDate ? `AND block_timestamp >= '${formatDateForSql(startDate)}'` : ''
    }
    ${endDate ? `AND block_timestamp <= '${formatDateForSql(endDate)}'` : ''}
  `;

  const result = await runBaseSqlQuery(sql, z.array(outputSchema));

  if (!result || result.length === 0) {
    return {
      total_transactions: 0n,
      total_amount: 0n,
      unique_buyers: 0n,
      unique_sellers: 0n,
      latest_block_timestamp: new Date(),
    };
  }

  return result[0];
};
