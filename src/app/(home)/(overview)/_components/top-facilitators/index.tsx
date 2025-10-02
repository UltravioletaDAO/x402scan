import { api } from '@/trpc/server';
import { Section } from '../utils';
import { FacilitatorCard, LoadingFacilitatorCard } from './_components/card';
import { facilitators } from '@/lib/facilitators';
import { Suspense } from 'react';

export const TopFacilitators = async () => {
  return (
    <Suspense fallback={<LoadingTopFacilitators />}>
      <TopFacilitatorsContent />
    </Suspense>
  );
};

const TopFacilitatorsContent = async () => {
  const [overallStats, facilitatorsData] = await Promise.all([
    api.stats.getOverallStatistics({}),
    api.facilitators.list({}),
  ]);

  if (!facilitatorsData) {
    return null;
  }

  return (
    <Container>
      {facilitators.map(facilitator => (
        <FacilitatorCard
          key={facilitator.name}
          facilitator={facilitator}
          stats={
            facilitatorsData.find(f => f.facilitator_name === facilitator.name)!
          }
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
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </Section>
  );
};
