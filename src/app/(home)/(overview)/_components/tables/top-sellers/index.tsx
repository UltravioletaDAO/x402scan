import { api, HydrateClient } from '@/trpc/server';

import { LoadingSellersTable, SellersTable } from '../lib';

import { TopSellersTable } from './table';

import { defaultSorting, limit } from '../../lib/defaults';

export const TopSellers = () => {
  void api.sellers.list.all.prefetch({
    sorting: defaultSorting,
    limit,
  });

  return (
    <HydrateClient>
      <TopSellersContainer>
        <TopSellersTable />
      </TopSellersContainer>
    </HydrateClient>
  );
};

export const LoadingTopSellers = () => {
  return (
    <TopSellersContainer>
      <LoadingSellersTable />
    </TopSellersContainer>
  );
};

const TopSellersContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <SellersTable
      title="Top Sellers"
      description="Top sellers by tx count, total amount, and latest transaction"
    >
      {children}
    </SellersTable>
  );
};
