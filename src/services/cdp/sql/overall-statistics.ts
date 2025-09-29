import z from 'zod';

import { runBaseSqlQuery } from './query';

import { ethereumAddressSchema } from '@/lib/schemas';
import { formatDateForSql } from './lib';

export const overallStatisticsInputSchema = z.object({
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
  const { addresses, startDate, endDate } = parseResult.data;
  const outputSchema = z.object({
    total_transactions: z.coerce.bigint(),
    total_amount: z.coerce.bigint(),
    unique_buyers: z.coerce.bigint(),
    unique_sellers: z.coerce.bigint(),
  });

  const sql = `SELECT 
    COUNT(*) AS total_transactions,
    SUM(parameters['value']::UInt256) AS total_amount,
    COUNT(DISTINCT parameters['from']::String) AS unique_buyers,
    COUNT(DISTINCT parameters['to']::String) AS unique_sellers
FROM base.events 
WHERE event_signature = 'Transfer(address,address,uint256)'
    AND address = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
    AND transaction_from IN (
        '0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', 
        '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'
    )
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
    };
  }

  return result[0];
};

export const getFirstTransferTimestampInputSchema = z.object({
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
  const { addresses, startDate, endDate } = parseResult.data;

  const sql = `SELECT block_timestamp
    FROM base.events
    WHERE event_signature = 'Transfer(address,address,uint256)'
      AND address = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
      AND transaction_from IN (
        '0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', 
        '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'
      )
      ${
        addresses
          ? `AND parameters['to']::String IN (${addresses
              .map(a => `'${a}'`)
              .join(', ')})`
          : ''
      }
      ${
        startDate
          ? `AND block_timestamp >= '${formatDateForSql(startDate)}'`
          : ''
      }
      ${endDate ? `AND block_timestamp <= '${formatDateForSql(endDate)}'` : ''}
    ORDER BY block_timestamp ASC
    LIMIT 1
  `;

  const result = await runBaseSqlQuery(
    sql,
    z.array(z.object({ block_timestamp: z.string() }))
  );

  if (!result || result.length === 0) {
    return null;
  }

  // Assuming block_timestamp is an ISO string or compatible with Date
  return new Date(result[0].block_timestamp);
};
