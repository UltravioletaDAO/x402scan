import { Body, Heading } from '@/app/_components/layout/page-utils';
import { ResourceTable } from './_components/resource-table';

export default function ResourcesPage() {
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
