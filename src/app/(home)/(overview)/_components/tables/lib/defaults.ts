import type { SortType } from "./types";

export const defaultSorting: SortType[] = [
  { id: "tx_count" as const, desc: true },
  { id: "total_amount" as const, desc: true },
  { id: "latest_block_timestamp" as const, desc: true },
  { id: "unique_buyers" as const, desc: true },
];

export const limit = 100;
