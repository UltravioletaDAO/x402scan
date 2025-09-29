import { Body } from '@/app/_components/layout/page-utils';
import { Suspense } from 'react';
import { HeaderCard, LoadingHeaderCard } from './_components/header';
import { Activity, LoadingActivity } from './_components/activity';

export default async function RecipientPage({
  params,
}: PageProps<'/recipient/[address]'>) {
  const { address } = await params;

  return (
    <Body className="gap-0 pt-0">
      <Suspense fallback={<LoadingHeaderCard />}>
        <HeaderCard address={address} />
      </Suspense>
      <Suspense fallback={<LoadingActivity />}>
        <Activity address={address} />
      </Suspense>
    </Body>
  );
}
