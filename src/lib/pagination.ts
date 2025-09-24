import { z } from "zod";

export const infiniteQuerySchema = <T>(cursorType: z.ZodType<T>) =>
  z.object({
    cursor: cursorType.optional(),
    limit: z.number().optional().default(10),
  });

export const timeInfiniteQuerySchema = infiniteQuerySchema(z.date());

interface ToPaginatedResponseParams<T> {
  items: T[];
  limit: number;
}

export const toPaginatedResponse = <T>({
  items,
  limit,
}: ToPaginatedResponseParams<T>) => {
  return {
    items: items.slice(0, limit),
    hasNextPage: items.length > limit,
  };
};
