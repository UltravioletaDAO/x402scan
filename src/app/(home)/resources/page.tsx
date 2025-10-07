import { Body, Heading } from '../../_components/layout/page-utils';
import { api } from '@/trpc/server';
import { ResourcesByOrigin } from '@/app/_components/resources/by-origin';

export default async function ResourcesPage() {
  const resources = await api.origins.list.withResources.all();

  return (
    <div>
      <Heading title="All Resources" />
      <Body>
        <ResourcesByOrigin originsWithResources={resources} />
      </Body>
    </div>
  );
}
