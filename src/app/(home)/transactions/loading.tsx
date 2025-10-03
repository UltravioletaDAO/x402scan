import { Body, Heading } from '@/app/_components/layout/page-utils';

import { LoadingLatestTransactionsTable } from '../_components/transactions';

export default function LoadingTransactionsPage() {
  console.log('transactions loading');

  return (
    <div>
      <Heading
        title="Transactions"
        description="All x402 transactions through the Coinbase facilitator"
      />
      <Body>
        <LoadingLatestTransactionsTable loadingRowCount={15} />
      </Body>
    </div>
  );
}
