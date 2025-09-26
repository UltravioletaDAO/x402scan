import z from "zod";

import { runBaseSqlQuery } from "./query";
import { ethereumAddressSchema } from "@/lib/schemas";

export const bucketedStatisticsInputSchema = z.object({
  addresses: z.array(ethereumAddressSchema).optional(),
});

export const getBucketedStatistics = async (
  input: z.input<typeof bucketedStatisticsInputSchema>
) => {
  const parseResult = bucketedStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error("Invalid input: " + parseResult.error.message);
  }
  const { addresses } = parseResult.data;
  const outputSchema = z.object({
    week_start: z.coerce.date(),
    total_transactions: z.coerce.bigint(),
    total_amount: z.coerce.bigint(),
    unique_buyers: z.coerce.bigint(),
    unique_sellers: z.coerce.bigint(),
  });

  const sql = `SELECT 
    toMonday(block_timestamp) AS week_start,
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
            .map((a) => `'${a}'`)
            .join(", ")})`
        : ""
    }
GROUP BY week_start
ORDER BY week_start ASC;
  `;

  const result = await runBaseSqlQuery(sql, z.array(outputSchema));

  if (!result || result.length === 0) {
    return [];
  }

  return result;
};
