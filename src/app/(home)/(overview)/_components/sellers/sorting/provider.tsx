import { SortingProvider } from '@/app/_contexts/sorting/provider';
import { SellersSortingContext } from './context';

import type { SellerSortId } from '@/services/cdp/sql/sellers/list';
import type { SortType } from '@/types/sorting';

export const SellersSortingProvider = ({
  children,
  initialSorting,
}: {
  children: React.ReactNode;
  initialSorting: SortType<SellerSortId>;
}) => {
  return (
    <SortingProvider
      context={SellersSortingContext}
      initialSorting={initialSorting}
    >
      {children}
    </SortingProvider>
  );
};
