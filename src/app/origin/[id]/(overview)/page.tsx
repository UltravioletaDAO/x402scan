import { Suspense } from 'react';
import { HeaderCard, LoadingHeaderCard } from './_components/header';
import { api, HydrateClient } from '@/trpc/server';
import { notFound } from 'next/navigation';
import { Body } from '@/app/_components/layout/page-utils';
import { OriginResources } from './_components/resources';
import { OriginActivity } from './_components/activity';

export default async function OriginPage({
  params,
}: PageProps<'/origin/[id]'>) {
  const { id } = await params;
  const origin = await api.public.origins.get(id);
  if (!origin) {
    return notFound();
  }

  await api.public.origins.getMetadata.prefetch(id);

  return (
    <HydrateClient>
      <Body className="pt-0 gap-0">
        <Suspense fallback={<LoadingHeaderCard />}>
          <HeaderCard origin={origin} />
        </Suspense>
        <div className="md:grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="col-span-5 pl-2 md:pl-4">
            <OriginResources originId={id} />
          </div>
          <div className="col-span-2 py-4">
            <OriginActivity originId={id} />
          </div>
        </div>
      </Body>
    </HydrateClient>
  );
}
