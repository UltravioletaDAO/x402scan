import { Body, Heading } from '@/app/_components/layout/page-utils';

import { Card } from '@/components/ui/card';

import { LoadingFacilitatorsChart } from './_components/chart';
import { LoadingFacilitatorsTable } from './_components/facilitators';

export default async function FacilitatorsPage() {
  return (
    <div>
      <Heading
        title="Facilitators"
        description="Top facilitators processing x402 transactions"
      />
      <Body>
        <Card className="overflow-hidden">
          <LoadingFacilitatorsChart />
        </Card>
        <LoadingFacilitatorsTable />
      </Body>
    </div>
  );
}
