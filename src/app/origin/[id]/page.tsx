import { Suspense } from 'react';
import { HeaderCard, LoadingHeaderCard } from './_components/header';
import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';
import { Body } from '@/app/_components/layout/page-utils';
import { OriginResources } from './_components/resources';

export default async function OriginPage({
  params,
}: PageProps<'/origin/[id]'>) {
  const { id } = await params;
  const origin = await api.public.origins.get(id);
  if (!origin) {
    return notFound();
  }
  return (
    <Body className="gap-8 pt-0">
      <Suspense fallback={<LoadingHeaderCard />}>
        <HeaderCard origin={origin} />
      </Suspense>
      <div className="grid grid-cols-1 md:grid-cols-7">
        <div className="col-span-5">
          <OriginResources originId={id} />
        </div>
        <div className="col-span-2"></div>
      </div>
    </Body>
  );
}
