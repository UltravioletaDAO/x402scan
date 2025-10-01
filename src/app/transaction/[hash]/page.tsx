import { Heading } from '@/app/_components/layout/page-utils';
import { Address } from '@/components/ui/address';
import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';

export default async function TransactionPage({
  params,
}: PageProps<'/transaction/[hash]'>) {
  const { hash } = await params;

  const transaction = await api.transactions.get(hash);

  if (!transaction) {
    return notFound();
  }

  return (
    <div>
      <Heading
        title="Transaction Details"
        description={
          <Address address={hash} className="text-sm" side="bottom" />
        }
      />
    </div>
  );
}
