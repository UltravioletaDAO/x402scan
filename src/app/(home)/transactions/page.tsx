import { Body, Heading } from '@/app/_components/layout/page-utils';
import { api, HydrateClient } from '@/trpc/server';
import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '../_components/transactions';
import { Suspense } from 'react';

export default function TransactionsPage() {
  const limit = 150;

  void api.transactions.list.prefetch({
    limit,
  });

  return (
    <HydrateClient>
      <Heading
        title="Transactions"
        description="All x402 transactions through the Coinbase facilitator"
      />
      <Body>
        <Suspense
          fallback={<LoadingLatestTransactionsTable loadingRowCount={15} />}
        >
          <LatestTransactionsTable limit={limit} pageSize={15} />
        </Suspense>
      </Body>
    </HydrateClient>
  );
}
