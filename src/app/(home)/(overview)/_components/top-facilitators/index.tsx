import { api, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { DEFAULT_CHAIN } from '@/types/chain';
import { TopFacilitatorsContent } from './content';
import { LoadingTopFacilitators } from './loading';
import { facilitators } from '@/lib/facilitators';

export const TopFacilitators = async () => {
  // Get facilitators for the default chain
  const facilitatorAddresses = facilitators.flatMap(
    f => f.addresses[DEFAULT_CHAIN] ?? []
  );

  // Prefetch all data including chart data for each facilitator
  await Promise.all([
    api.stats.getOverallStatistics.prefetch({ chain: DEFAULT_CHAIN }),
    api.facilitators.list.prefetch({ chain: DEFAULT_CHAIN, limit: 3 }),
    // Prefetch chart data for each facilitator on this chain
    ...facilitatorAddresses.map(address =>
      api.stats.getBucketedStatistics.prefetch({
        numBuckets: 48,
        facilitators: [address],
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
