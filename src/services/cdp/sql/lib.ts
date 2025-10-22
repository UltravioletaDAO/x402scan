import { facilitators } from '@/lib/facilitators';
import { mixedAddressSchema } from '@/lib/schemas';
import { USDC_ADDRESS } from '@/lib/utils';
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from '@/types/chain';
import z from 'zod';

// Helper function to apply chain-specific defaults
export const applyBaseQueryDefaults = <
  T extends z.infer<typeof baseQuerySchema>,
>(
  data: T
): Required<T> => {
  const chainFacilitators = facilitators.filter(f => f.chain === data.chain);
  return {
    ...data,
    facilitators:
      data.facilitators ?? chainFacilitators.flatMap(f => f.addresses as string[]),
    tokens: data.tokens ?? [USDC_ADDRESS[data.chain]],
  } as Required<T>;
};

export const baseQuerySchema = z.object({
  chain: z.enum(SUPPORTED_CHAINS).default(DEFAULT_CHAIN),
  facilitators: z.array(mixedAddressSchema).optional(),
  tokens: z.array(mixedAddressSchema).optional(),
});

export const sortingSchema = (sortIds: string[] | readonly string[]) =>
  z.object({
    id: z.enum(sortIds),
    desc: z.boolean(),
  });
