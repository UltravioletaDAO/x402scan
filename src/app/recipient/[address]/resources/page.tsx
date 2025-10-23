import { Body, Heading } from '@/app/_components/layout/page-utils';

import { ResourcesByOrigin } from '@/app/_components/resources/by-origin';
import { getChain } from '@/app/_lib/chain';

import { api, HydrateClient } from '@/trpc/server';

export default async function ResourcesPage({
  params,
  searchParams,
}: PageProps<'/recipient/[address]/resources'>) {
  const { address } = await params;
  const chain = await searchParams.then(params => getChain(params.chain));

  await api.origins.list.withResources.prefetch({
    address,
    chain,
  });

  return (
    <HydrateClient>
      <Heading
        title="Resources"
        description="Resources provided by this address grouped by server origin"
      />
      <Body className="gap-0">
        <ResourcesByOrigin emptyText="No resources found for this address" />
      </Body>
    </HydrateClient>
  );
}
