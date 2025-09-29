import z from "zod";

import { runBaseSqlQuery } from "./query";

import { ethereumAddressSchema } from "@/lib/schemas";

export const listFacilitatorTransactionsInputSchema = z.object({
  recipient: ethereumAddressSchema,
  after: z
    .object({
      timestamp: z.date(),
      logIndex: z.number().optional(),
    })
    .optional(),
  limit: z.number().default(100),
});

const outputSchema = z.array(
  z.object({
    sender: ethereumAddressSchema,
    recipient: ethereumAddressSchema,
    amount: z.coerce.bigint(),
    token_address: ethereumAddressSchema,
    transaction_hash: z.string(),
    block_timestamp: z.coerce.date(),
    log_index: z.number(),
  }),
);

export const listFacilitatorTransactions = async (
  input: z.input<typeof listFacilitatorTransactionsInputSchema>,
) => {
  const parseResult = listFacilitatorTransactionsInputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error("invalid input", input);
    throw new Error("Invalid input: " + parseResult.error.message);
  }
  const { recipient, after, limit } = parseResult.data;

  // Escape the recipient address to prevent SQL injection
  const escapedRecipient = recipient.replace(/'/g, "''");

  // Build the WHERE clause with proper escaping
  let whereClause = `event_signature = 'Transfer(address,address,uint256)'
  AND transaction_from in ('0xd8dfc729cbd05381647eb5540d756f4f8ad63eec', '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6')
  AND recipient = '${escapedRecipient}'`;

  if (after) {
    // Format date properly for ClickHouse/Base SQL
    const formattedDate = after.timestamp
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    if (after.logIndex !== undefined) {
      // If we have a logIndex, use it for more precise pagination
      whereClause += ` AND (block_timestamp > '${formattedDate}' OR (block_timestamp = '${formattedDate}' AND log_index > ${after.logIndex}))`;
    } else {
      // Fallback to timestamp-only comparison
      whereClause += ` AND block_timestamp > '${formattedDate}'`;
    }
  }

  const sql = `SELECT
  parameters['from']::String AS sender,
  parameters['to']::String AS recipient,
  parameters['value']::UInt256 AS amount,
  transaction_from,
  address AS token_address,
  transaction_hash,
  block_timestamp,
  log_index
FROM base.events
WHERE ${whereClause}
ORDER BY block_timestamp, log_index ASC
LIMIT ${limit};`;
  return await runBaseSqlQuery(sql, outputSchema);
};
