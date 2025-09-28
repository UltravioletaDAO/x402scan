import z from "zod";

import { runBaseSqlQuery } from "./query";
import { ethereumAddressSchema } from "@/lib/schemas";
import { subMonths } from "date-fns";
import { formatDateForSql } from "./lib";

export const bucketedStatisticsInputSchema = z.object({
  addresses: z.array(ethereumAddressSchema).optional(),
  startDate: z
    .date()
    .optional()
    .default(() => subMonths(new Date(), 1)),
  endDate: z
    .date()
    .optional()
    .default(() => new Date()),
  numBuckets: z.number().optional().default(48),
});

export const getBucketedStatistics = async (
  input: z.input<typeof bucketedStatisticsInputSchema>
) => {
  const parseResult = bucketedStatisticsInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error("Invalid input: " + parseResult.error.message);
  }
  const { addresses, startDate, endDate, numBuckets } = parseResult.data;
  const outputSchema = z.object({
    bucket_start: z.coerce.date(),
    total_transactions: z.coerce.bigint(),
    total_amount: z.coerce.bigint(),
    unique_buyers: z.coerce.bigint(),
    unique_sellers: z.coerce.bigint(),
  });

  const timeRangeMs = endDate.getTime() - startDate.getTime();
  const bucketSizeMs = Math.floor(timeRangeMs / numBuckets);
  const bucketSizeSeconds = Math.max(1, Math.floor(bucketSizeMs / 1000)); // Ensure at least 1 second

  // Use mathematical bucketing approach
  const sql = `SELECT 
    toDateTime(toUInt32(toUnixTimestamp(block_timestamp) / ${bucketSizeSeconds}) * ${bucketSizeSeconds}) AS bucket_start,
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
    ${
      startDate ? `AND block_timestamp >= '${formatDateForSql(startDate)}'` : ""
    }
    ${endDate ? `AND block_timestamp <= '${formatDateForSql(endDate)}'` : ""}
GROUP BY bucket_start
ORDER BY bucket_start ASC;
  `;

  const result = await runBaseSqlQuery(sql, z.array(outputSchema));

  if (!result || result.length === 0) {
    return [];
  }

  return result;
};
