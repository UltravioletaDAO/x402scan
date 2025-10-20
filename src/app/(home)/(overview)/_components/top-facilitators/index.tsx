import { Suspense } from 'react';

import { Section } from '@/app/_components/layout/page-utils';

import { FacilitatorCard, LoadingFacilitatorCard } from './_components/card';

import { api } from '@/trpc/server';

export const TopFacilitators = async () => {
  return (
    <Suspense fallback={<LoadingTopFacilitators />}>
      <TopFacilitatorsContent />
    </Suspense>
  );
};

const TopFacilitatorsContent = async () => {
  const [overallStats, facilitatorsData] = await Promise.all([
    api.public.stats.overall({}),
    api.public.facilitators.list({
      limit: 3,
    }),
  ]);

  if (!facilitatorsData) {
    return null;
  }

  return (
    <Container>
      {facilitatorsData.map(stats => (
        <FacilitatorCard
          key={stats.facilitator_name}
          facilitator={stats.facilitator}
          stats={stats}
          overallStats={overallStats}
        />
      ))}
    </Container>
  );
};

export const LoadingTopFacilitators = () => {
  return (
    <Container>
      {Array.from({ length: 3 }).map((_, index) => (
        <LoadingFacilitatorCard key={index} />
      ))}
    </Container>
  );
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Section
      title="Top Facilitators"
      description="Analytics on facilitators processing x402 transfers"
      className="gap-4"
      href="/facilitators"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </Section>
  );
};
