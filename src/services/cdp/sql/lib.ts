import { facilitators } from '@/lib/facilitators';
import { mixedAddressSchema } from '@/lib/schemas';
import { USDC_ADDRESS } from '@/lib/utils';
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from '@/types/chain';
import z from 'zod';

export const formatDateForSql = (date: Date) => {
  return date.toISOString().replace('T', ' ').replace('Z', '');
};

export const baseQuerySchema = z.object({
  chain: z.enum(SUPPORTED_CHAINS).default(DEFAULT_CHAIN),
  facilitators: z
    .array(mixedAddressSchema)
    .min(1)
    .default(
      facilitators
        .filter(f => f.chain === DEFAULT_CHAIN)
        .flatMap(f => f.addresses)
    ),
  tokens: z.array(mixedAddressSchema).min(1).default([USDC_ADDRESS]),
});

export const sortingSchema = (sortIds: string[] | readonly string[]) =>
  z.object({
    id: z.enum(sortIds),
    desc: z.boolean(),
  });
