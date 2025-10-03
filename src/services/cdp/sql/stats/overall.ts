import { unstable_cache } from 'next/cache';
import z from 'zod';

import { runBaseSqlQuery } from '../query';

import { ethereumAddressSchema } from '@/lib/schemas';
import { baseQuerySchema, formatDateForSql } from '../lib';

export const overallStatisticsInputSchema = baseQuerySchema.extend({
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const getOverallStatisticsUncached = async (
  input: z.input<typeof overallStatisticsInputSchema>
) => {
  const parseResult = overallStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { addresses, startDate, endDate, facilitators, tokens } =
    parseResult.data;
  const outputSchema = z.object({
    total_transactions: z.coerce.number(),
    total_amount: z.coerce.number(),
    unique_buyers: z.coerce.number(),
    unique_sellers: z.coerce.number(),
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
      total_transactions: 0,
      total_amount: 0,
      unique_buyers: 0,
      unique_sellers: 0,
      latest_block_timestamp: new Date(),
    };
  }

  const data = result[0];
  return {
    total_transactions: data.total_transactions,
    total_amount: data.total_amount,
    unique_buyers: data.unique_buyers,
    unique_sellers: data.unique_sellers,
    latest_block_timestamp: data.latest_block_timestamp,
  };
};

const createCacheKey = (input: z.input<typeof overallStatisticsInputSchema>) => {
  // Round dates to nearest minute for stable cache keys
  const roundDate = (date?: Date) => {
    if (!date) return undefined;
    const rounded = new Date(date);
    rounded.setSeconds(0, 0);
    return rounded.toISOString();
  };

  return JSON.stringify({
    addresses: input.addresses?.sort(),
    startDate: roundDate(input.startDate),
    endDate: roundDate(input.endDate),
    facilitators: input.facilitators?.sort(),
    tokens: input.tokens?.sort(),
  });
};

export const getOverallStatistics = async (
  input: z.input<typeof overallStatisticsInputSchema>
) => {
  const cacheKey = createCacheKey(input);

  const result = await unstable_cache(
    async () => {
      const data = await getOverallStatisticsUncached(input);
      // Convert date to ISO string for JSON serialization
      return {
        ...data,
        latest_block_timestamp: data.latest_block_timestamp.toISOString(),
      };
    },
    ['overall-statistics', cacheKey],
    {
      revalidate: 60,
      tags: ['statistics'],
    }
  )();

  // Convert ISO string back to Date object
  return {
    ...result,
    latest_block_timestamp: new Date(result.latest_block_timestamp),
  };
};
