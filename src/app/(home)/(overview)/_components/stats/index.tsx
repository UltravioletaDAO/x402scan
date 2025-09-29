import React, { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { api, HydrateClient } from '@/trpc/server';

import { OverallCharts, LoadingOverallCharts } from './charts';
import { Section } from '../utils';
import { differenceInSeconds, subMonths, subSeconds } from 'date-fns';
import { TimeRangeProvider } from '@/app/_components/time-range-selector/context';
import { RangeSelector } from '@/app/_components/time-range-selector/range-selector';
import { ActivityTimeframe } from '@/types/timeframes';
import { firstTransfer } from '@/services/cdp/facilitator/constants';

export const OverallStats = async () => {
  const endDate = new Date();
  const startDate = subMonths(endDate, 1);

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
