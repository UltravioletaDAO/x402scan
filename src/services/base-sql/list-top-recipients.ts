import z from "zod";

import { runBaseSqlQuery } from "./query";
import { ethereumAddressSchema } from "@/lib/schemas";

const sortType = z.enum(["tx_count", "total_amount"]);

const inputSchema = z.object({
  cursor: z.number().optional(),
  limit: z.number().default(10),
  sortType: sortType.default("total_amount"),
});

export const listTopRecipients = async (input: z.input<typeof inputSchema>) => {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error("invalid input", input);
    throw new Error("Invalid input: " + parseResult.error.message);
  }
  const { cursor, limit, sortType } = parseResult.data;
  const outputSchema = z.array(
    z.object({
      recipient: ethereumAddressSchema,
      tx_count: z.coerce.number(),
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
    ${cursor ? `AND ${sortType} > '${cursor}'` : ""}
GROUP BY recipient 
ORDER BY ${sortType} DESC 
LIMIT ${limit};
  `;
  return await runBaseSqlQuery(sql, outputSchema);
};
