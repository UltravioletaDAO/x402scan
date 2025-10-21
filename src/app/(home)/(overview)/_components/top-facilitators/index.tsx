import { api, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { DEFAULT_CHAIN } from '@/types/chain';
import { TopFacilitatorsContent } from './content';
import { LoadingTopFacilitators } from './loading';
import { facilitators } from '@/lib/facilitators';

export const TopFacilitators = async () => {
  // Get facilitators for the default chain
  const chainFacilitators = facilitators.filter(f => f.chain === DEFAULT_CHAIN);

  // Prefetch all data including chart data for each facilitator
  await Promise.all([
    api.stats.getOverallStatistics.prefetch({ chain: DEFAULT_CHAIN }),
    api.facilitators.list.prefetch({ chain: DEFAULT_CHAIN, limit: 3 }),
    // Prefetch chart data for each facilitator on this chain
    ...chainFacilitators.map(facilitator =>
      api.stats.getBucketedStatistics.prefetch({
        numBuckets: 48,
        facilitators: facilitator.addresses,
      })
    ),
  ]);

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingTopFacilitators />}>
        <TopFacilitatorsContent />
      </Suspense>
    </HydrateClient>
  );
};
