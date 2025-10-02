import type { SellerSortId } from '@/services/cdp/sql/sellers/list';
import type { SortType } from '@/types/sorting';

export const defaultSellersSorting: SortType<SellerSortId> = {
  id: 'tx_count',
  desc: true,
};
