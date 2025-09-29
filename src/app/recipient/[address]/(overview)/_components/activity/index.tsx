import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { subDays } from 'date-fns';

import { Card } from '@/components/ui/card';

import { api, HydrateClient } from '@/trpc/server';

import { RangeSelector } from '@/app/_components/time-range-selector/range-selector';
import { ActivityCharts, LoadingActivityCharts } from './charts';
import { TimeRangeProvider } from '@/app/_components/time-range-selector/context';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityTimeframe } from '@/types/timeframes';

interface Props {
  address: string;
}

const ActivityContainer = ({
  children,
  isLoading = false,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Activity</h3>
        {isLoading ? <Skeleton className="w-24 h-8" /> : <RangeSelector />}
      </div>
      <Card className="p-0 overflow-hidden relative">{children}</Card>
    </div>
  );
};

export const Activity: React.FC<Props> = async ({ address }) => {
  const firstTransferTimestamp = await api.stats.getFirstTransferTimestamp({
    addresses: [address],
  });
  const endDate = new Date();
  const startDate = subDays(endDate, 7);

  void api.stats.getBucketedStatistics.prefetch({
    addresses: [address],
    startDate,
    endDate,
  });

  return (
    <HydrateClient>
      <TimeRangeProvider
        creationDate={firstTransferTimestamp ?? startDate}
        initialEndDate={endDate}
        initialStartDate={startDate}
        initialTimeframe={ActivityTimeframe.SevenDays}
      >
        <ActivityContainer>
          <ErrorBoundary
            fallback={<p>There was an error loading the activity data</p>}
          >
            <Suspense fallback={<LoadingActivityCharts />}>
              <ActivityCharts address={address} />
            </Suspense>
          </ErrorBoundary>
        </ActivityContainer>
      </TimeRangeProvider>
    </HydrateClient>
  );
};

export const LoadingActivity = () => {
  return (
    <ActivityContainer isLoading>
      <LoadingActivityCharts />
    </ActivityContainer>
  );
};
