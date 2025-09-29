import { Body } from '@/app/_components/layout/page-utils';

import { LoadingHeaderCard } from './_components/header';
import { LoadingActivity } from './_components/activity';

export default async function LoadingRecipientPage() {
  return (
    <Body className="gap-0 pt-0">
      <LoadingHeaderCard />
      <LoadingActivity />
    </Body>
  );
}
