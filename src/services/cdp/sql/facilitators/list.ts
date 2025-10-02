import { facilitators } from '@/lib/facilitators';
import { runBaseSqlQuery } from '../query';
import { formatDateForSql } from '../lib';
import z from 'zod';
import { ethereumAddressSchema } from '@/lib/schemas';
import { USDC_ADDRESS } from '@/lib/utils';

export const listTopFacilitatorsInputSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: z
    .array(
      z.object({
        id: z.enum([
          'tx_count',
          'total_amount',
          'latest_block_timestamp',
          'unique_buyers',
        ]),
        desc: z.boolean(),
      })
    )
    .default([{ id: 'tx_count', desc: true }]),
  tokens: z.array(ethereumAddressSchema).default([USDC_ADDRESS]),
});

export const listTopFacilitators = async (
  input: z.input<typeof listTopFacilitatorsInputSchema>
) => {
  const { startDate, endDate, limit, sorting, tokens } =
    listTopFacilitatorsInputSchema.parse(input);

  const sql = `SELECT 
    COUNT(DISTINCT parameters['to']::String) AS sellers,
    COUNT(DISTINCT parameters['from']::String) AS buyers,
    COUNT(*) AS tx_count, 
    SUM(parameters['value']::UInt256) AS total_amount,
    max(block_timestamp) AS latest_block_timestamp,
    COUNT(DISTINCT parameters['from']::String) AS unique_buyers,
    CASE
    ${facilitators
      .map(
        f =>
          `WHEN transaction_from IN (${f.addresses
            .map(a => `'${a}'`)
            .join(', ')}) THEN '${f.name}'`
      )
      .join('\n        ')}
    ELSE 'Unknown'
    END AS facilitator_name
FROM base.events 
WHERE event_signature = 'Transfer(address,address,uint256)'
    AND address IN (${tokens.map(t => `'${t}'`).join(', ')})
    AND transaction_from IN (${facilitators
      .flatMap(f => f.addresses)
      .map(a => `'${a}'`)
      .join(', ')})
    ${
      startDate ? `AND block_timestamp >= '${formatDateForSql(startDate)}'` : ''
    }
    ${endDate ? `AND block_timestamp <= '${formatDateForSql(endDate)}'` : ''}
GROUP BY 
    CASE
    ${facilitators
      .map(
        f =>
          `WHEN transaction_from IN (${f.addresses
            .map(a => `'${a}'`)
            .join(', ')}) THEN '${f.name}'`
      )
      .join('\n        ')}
    ELSE 'Unknown'
    END
ORDER BY ${sorting.map(s => `${s.id} ${s.desc ? 'DESC' : 'ASC'}`).join(', ')} 
LIMIT ${limit + 1}`;
  const result = await runBaseSqlQuery(
    sql,
    z.array(
      z.object({
        sellers: z.coerce.bigint(),
        buyers: z.coerce.bigint(),
        tx_count: z.coerce.bigint(),
        total_amount: z.coerce.bigint(),
        latest_block_timestamp: z.coerce.date(),
        unique_buyers: z.coerce.bigint(),
        facilitator_name: z.string(),
      })
    )
  );
  return result;
};
