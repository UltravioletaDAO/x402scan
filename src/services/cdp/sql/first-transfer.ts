import z from "zod";

import { runBaseSqlQuery } from "./query";
import { ethereumAddressSchema } from "@/lib/schemas";

export const firstTransferInputSchema = z.object({
  addresses: z.array(ethereumAddressSchema).optional(),
});

export const getFirstTransferTimestamp = async (
  input: z.input<typeof firstTransferInputSchema>
) => {
  const parseResult = firstTransferInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error("Invalid input: " + parseResult.error.message);
  }
  const { addresses } = parseResult.data;

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
              .map((a) => `'${a}'`)
              .join(", ")})`
          : ""
      }
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
