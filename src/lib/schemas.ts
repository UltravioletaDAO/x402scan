import z from 'zod';

import type { Address, Hash } from 'viem';
import type { FacilitatorAddress } from './facilitators';

export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
  .transform(address => address.toLowerCase() as Address);

export const facilitatorAddressSchema = ethereumAddressSchema.transform(
  address => address as FacilitatorAddress
);

export const ethereumHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
  .transform(hash => hash.toLowerCase() as Hash);

// Add a Solana address schema
export const solanaAddressSchema = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana address');

// Create a mixed address schema
export const mixedAddressSchema = z.union([
  ethereumAddressSchema,
  solanaAddressSchema,
]);
