import { z } from "zod";

export const infiniteQuerySchema = <T>(cursorType: z.ZodType<T>) =>
  z.object({
    cursor: cursorType.optional(),
    limit: z.number().optional().default(10),
  });

export const timeInfiniteQuerySchema = infiniteQuerySchema(z.date());
