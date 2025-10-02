import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { Body, Heading } from '@/app/_components/layout/page-utils';

import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '../_components/transactions/table';

import { api, HydrateClient } from '@/trpc/server';
import { facilitatorIdMap } from '@/lib/facilitators';

export default async function TransactionsPage({
  params,
}: PageProps<'/facilitator/[id]/transactions'>) {
  const { id } = await params;

  const facilitator = facilitatorIdMap.get(id);

  if (!facilitator) {
    return notFound();
  }

  const limit = 150;

  void api.transfers.list.prefetch({
    limit,
    facilitators: facilitator.addresses,
  });

  return (
    <HydrateClient>
      <Heading
        title="Transactions"
        description="Transactions made through this facilitator"
      />
      <Body>
        <Suspense
          fallback={<LoadingLatestTransactionsTable loadingRowCount={15} />}
        >
          <LatestTransactionsTable
            addresses={facilitator.addresses}
            limit={limit}
            pageSize={15}
          />
        </Suspense>
      </Body>
    </HydrateClient>
  );
}
