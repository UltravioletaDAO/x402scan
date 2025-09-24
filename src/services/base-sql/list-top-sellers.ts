import z from "zod";

import { runBaseSqlQuery } from "./query";
import { ethereumAddressSchema } from "@/lib/schemas";
import { infiniteQuerySchema } from "@/lib/pagination";

const sortType = z.enum(["tx_count", "total_amount"]);

const paginationSchema = infiniteQuerySchema(z.bigint());

export const listTopSellersInputSchema = z.object({
  sortType: sortType.default("total_amount"),
});

export const listTopSellers = async (
  input: z.input<typeof listTopSellersInputSchema>,
  pagination: z.infer<typeof paginationSchema>
) => {
  const parseResult = listTopSellersInputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error("invalid input", input);
    throw new Error("Invalid input: " + parseResult.error.message);
  }
  const { sortType } = parseResult.data;
  const { cursor, limit } = pagination;
  const outputSchema = z.array(
    z.object({
      recipient: ethereumAddressSchema,
      tx_count: z.coerce.bigint(),
      total_amount: z.coerce.bigint(),
    })
  );

  const sql = `SELECT 
    parameters['to']::String AS recipient, 
    COUNT(*) AS tx_count, 
    SUM(parameters['value']::UInt256) AS total_amount 
FROM base.events 
WHERE event_signature = 'Transfer(address,address,uint256)' 
    AND transaction_from IN (
        '0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', 
        '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'
    ) 
    ${cursor ? `AND ${sortType} > '${cursor.toString()}'` : ""}
GROUP BY recipient 
ORDER BY ${sortType} DESC 
LIMIT ${limit};
  `;
  return await runBaseSqlQuery(sql, outputSchema);
};
