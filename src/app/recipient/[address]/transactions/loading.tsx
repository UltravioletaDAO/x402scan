import { Body, Heading } from '@/app/_components/layout/page-utils';

import { LoadingLatestTransactionsTable } from '../_components/transactions/table';

export default function LoadingTransactionsPage() {
  return (
    <div>
      <Heading
        title="Transactions"
        description="Transactions made through the Coinbase facilitator to this recipient address"
      />
      <Body>
        <LoadingLatestTransactionsTable loadingRowCount={15} />
      </Body>
    </div>
  );
}
