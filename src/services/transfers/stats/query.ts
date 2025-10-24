import z from 'zod';

import { mixedAddressSchema } from '@/lib/schemas';

import { baseQuerySchema } from '../schemas';

export const baseStatsQuerySchema = baseQuerySchema.extend({
  addresses: z.object({
    include: z.array(mixedAddressSchema).optional(),
    exclude: z.array(mixedAddressSchema).optional(),
  }),
});
