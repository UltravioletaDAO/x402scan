import z from 'zod';

interface ToPaginatedResponseParams<T> {
  items: T[];
  page_size: number;
}

export const paginatedQuerySchema = z.object({
  page: z.number().optional().default(0),
  page_size: z.number().optional().default(100),
});

export type PaginatedQueryParams = z.infer<typeof paginatedQuerySchema>;

export const toPaginatedResponse = <T>({
  items,
  page_size,
}: ToPaginatedResponseParams<T>): PaginatedResponse<T> => {
  return {
    items: items.slice(0, page_size),
    hasNextPage: items.length > page_size,
  };
};

export type PaginatedResponse<T> = {
  items: T[];
  hasNextPage: boolean;
};
