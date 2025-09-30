import { Suspense } from 'react';

import { Body, Heading } from '@/app/_components/layout/page-utils';

import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '../_components/transactions/table';

import { api, HydrateClient } from '@/trpc/server';

export default async function TransactionsPage({
  params,
}: PageProps<'/recipient/[address]/transactions'>) {
  const { address } = await params;

  const limit = 150;

  void api.transactions.list.prefetch({
    limit,
    recipient: address,
  });

  return (
    <HydrateClient>
      <Heading
        title="Transactions"
        description="Transactions made through the Coinbase facilitator to this recipient address"
      />
      <Body>
        <Suspense
          fallback={<LoadingLatestTransactionsTable loadingRowCount={15} />}
        >
          <LatestTransactionsTable
            address={address}
            limit={limit}
            pageSize={15}
          />
        </Suspense>
      </Body>
    </HydrateClient>
  );
}
