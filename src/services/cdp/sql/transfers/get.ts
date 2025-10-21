import type z from 'zod';

import { ethereumHashSchema } from '@/lib/schemas';
import { baseQuerySchema, applyBaseQueryDefaults } from '../lib';
import { transfersPrisma } from '@/services/db/transfers-client';
import { normalizeAddresses, normalizeAddress } from '@/lib/utils';

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
  const parsed = applyBaseQueryDefaults(parseResult.data);
  const { transaction_hash, tokens, facilitators, chain } = parsed;

  // Build the where clause for Prisma
  const where = {
    tx_hash: normalizeAddress(transaction_hash, chain),
    address: { in: normalizeAddresses(tokens, chain) },
    transaction_from: { in: normalizeAddresses(facilitators, chain) },
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
    amount: BigInt(
      Math.floor(transfer.amount * Math.pow(10, transfer.decimals))
    ),
    token_address: transfer.address,
    transaction_hash: transfer.tx_hash,
    block_timestamp: transfer.block_timestamp,
  };
};
