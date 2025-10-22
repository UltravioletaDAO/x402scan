import { SUPPORTED_CHAINS } from '@/types/chain';
import z from 'zod';

export const baseQuerySchema = z.object({
  chain: z.enum(SUPPORTED_CHAINS).optional(),
});

export const sortingSchema = (sortIds: string[] | readonly string[]) =>
  z.object({
    id: z.enum(sortIds),
    desc: z.boolean(),
  });
