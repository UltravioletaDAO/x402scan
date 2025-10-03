import React, { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { differenceInSeconds, subMonths, subSeconds } from 'date-fns';

import { Section } from '../utils';

import { OverallCharts, LoadingOverallCharts } from './charts';

import { RangeSelector } from '@/app/_contexts/time-range/component';

import { TimeRangeProvider } from '@/app/_contexts/time-range/provider';

import { api, HydrateClient } from '@/trpc/server';

import { firstTransfer } from '@/services/cdp/facilitator/constants';

import { ActivityTimeframe } from '@/types/timeframes';

// Import the cached functions directly
import { getOverallStatistics } from '@/services/cdp/sql/stats/overall';
import { getBucketedStatistics } from '@/services/cdp/sql/stats/bucketed';

export const OverallStats = async () => {
  // Round to nearest minute for cache consistency
  const now = new Date();
  const roundedMinutes = Math.floor(now.getMinutes() / 1) * 1;
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    roundedMinutes,
    0,
    0
  );
  const startDate = subMonths(endDate, 1);

  console.log('[SSR] Calling cached functions directly (bypassing tRPC)');

  // Call cached functions DIRECTLY instead of through tRPC
  // This ensures unstable_cache is not wrapped by React.cache()
  await getOverallStatistics({ startDate, endDate });
  await getOverallStatistics({
    startDate: subSeconds(startDate, differenceInSeconds(endDate, startDate)),
    endDate: startDate,
  });
  await getBucketedStatistics({ startDate, endDate, numBuckets: 32 });

  console.log('[SSR] Direct cache calls complete, now prefetching for React Query');

  // Still prefetch for React Query hydration
  void api.stats.getOverallStatistics.prefetch({
    startDate,
    endDate,
  });
  void api.stats.getOverallStatistics.prefetch({
    startDate: subSeconds(startDate, differenceInSeconds(endDate, startDate)),
    endDate: startDate,
  });
  void api.stats.getBucketedStatistics.prefetch({
    startDate,
    endDate,
    numBuckets: 32,
  });

  return (
    <HydrateClient>
      <TimeRangeProvider
        initialEndDate={endDate}
        initialTimeframe={ActivityTimeframe.ThirtyDays}
        initialStartDate={startDate}
        creationDate={firstTransfer}
      >
        <ActivityContainer>
          <ErrorBoundary
            fallback={<p>There was an error loading the activity data</p>}
          >
            <Suspense fallback={<LoadingOverallCharts />}>
              <OverallCharts />
            </Suspense>
          </ErrorBoundary>
        </ActivityContainer>
      </TimeRangeProvider>
    </HydrateClient>
  );
};

export const LoadingOverallStats = () => {
  return (
    <ActivityContainer>
      <LoadingOverallCharts />
    </ActivityContainer>
  );
};

const ActivityContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Section
      title="Overall Stats"
      description="Global statistics for the x402 ecosystem"
      actions={<RangeSelector />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </Section>
  );
};
