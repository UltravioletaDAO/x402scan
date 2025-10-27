import { Suspense } from 'react';
import { HeaderCard, LoadingHeaderCard } from './_components/header';
import { api, HydrateClient } from '@/trpc/server';
import { notFound } from 'next/navigation';
import { Body } from '@/app/_components/layout/page-utils';
import { OriginResources } from './_components/resources';
import { OriginActivity } from './_components/activity';
import { OriginAgents } from './_components/agents';

export default async function OriginPage({
  params,
}: PageProps<'/server/[id]'>) {
  const { id } = await params;
  const origin = await api.public.origins.get(id);
  if (!origin) {
    return notFound();
  }

  await api.public.origins.getMetadata.prefetch(id);

  return (
    <HydrateClient>
      <Body className="pt-0">
        <Suspense fallback={<LoadingHeaderCard />}>
          <HeaderCard origin={origin} />
        </Suspense>
        <OriginActivity originId={id} />
        <div className="md:grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
            <OriginResources originId={id} />
          </div>
          <div className="col-span-1">
            <OriginAgents originId={id} />
          </div>
        </div>
      </Body>
    </HydrateClient>
  );
}
