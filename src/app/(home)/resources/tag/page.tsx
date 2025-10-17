import { Body, Heading } from '@/app/_components/layout/page-utils';
import { ResourceTable } from './_components/resource-table';
import { Unauthorized } from '@/app/_components/unauthorized/Unauthorized';
import { auth } from '@/auth';

export default async function ResourcesPage() {
  const session = await auth();

  if (!session?.user?.id || !session.user.admin) {
    return <Unauthorized />;
  } 

  return (
    <div>
      <Heading
        title="Resource Tagging"
        description="Tag resources with categories to help users find them."
      />
      <Body>
        <ResourceTable />
      </Body>
    </div>
  );
}
