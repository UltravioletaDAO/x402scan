import z from 'zod';

import type { Address } from 'viem';

export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
  .transform(address => address.toLowerCase() as Address);
