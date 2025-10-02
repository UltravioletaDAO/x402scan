import { facilitators } from '@/lib/facilitators';
import { ethereumAddressSchema } from '@/lib/schemas';
import z from 'zod';

export const formatDateForSql = (date: Date) => {
  return date.toISOString().replace('T', ' ').replace('Z', '');
};

export const baseQuerySchema = z.object({
  facilitators: z
    .array(ethereumAddressSchema)
    .min(1)
    .default(facilitators.flatMap(f => f.addresses)),
  tokens: z
    .array(ethereumAddressSchema)
    .min(1)
    .default(['0x833589fcd6edb6e08f4c7c32d4f71b54bda02913']),
});
