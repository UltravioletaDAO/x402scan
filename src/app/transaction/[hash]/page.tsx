import { Heading } from '@/app/_components/layout/page-utils';

export default async function TransactionPage({
  params,
}: PageProps<'/transaction/[hash]'>) {
  const { hash } = await params;

  console.log(hash);

  return (
    <div>
      <Heading title="Transaction Details" description={hash} />
    </div>
  );
}
