import type z from 'zod';

import { ethereumHashSchema } from '@/lib/schemas';
import { baseQuerySchema } from '../lib';
import { transfersPrisma } from '@/services/db/transfers-client';

export const getFacilitatorTransferInputSchema = baseQuerySchema.extend({
  transaction_hash: ethereumHashSchema,
});

export const getFacilitatorTransfer = async (
  input: z.input<typeof getFacilitatorTransferInputSchema>
) => {
  const parseResult = getFacilitatorTransferInputSchema.safeParse(input);
  if (!parseResult.success) {
    console.error('invalid input', input);
    throw new Error('Invalid input: ' + parseResult.error.message);
  }
  const { transaction_hash, tokens, facilitators } = parseResult.data;

  // Build the where clause for Prisma
  const where = {
    tx_hash: transaction_hash.toLowerCase(),
    address: { in: tokens.map(t => t.toLowerCase()) },
    transaction_from: { in: facilitators.map(f => f.toLowerCase()) },
  };

  // Get the transfer from Neon database
  const transfer = await transfersPrisma.transferEvent.findFirst({
    where,
    orderBy: { block_timestamp: 'desc' },
  });

  if (!transfer) return null;

  // Map to expected output format
  return {
    sender: transfer.sender,
    recipient: transfer.recipient,
    amount: BigInt(Math.floor(transfer.amount * Math.pow(10, transfer.decimals))),
    token_address: transfer.address,
    transaction_hash: transfer.tx_hash,
    block_timestamp: transfer.block_timestamp,
  };
};