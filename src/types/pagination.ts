export type PaginatedResponse<T> = {
  items: T[];
  hasNextPage: boolean;
};

export type PaginationProps = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};
