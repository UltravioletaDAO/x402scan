import React, { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { Card } from "@/components/ui/card";

import { api, HydrateClient } from "@/trpc/server";

import { OverallCharts, LoadingOverallCharts } from "./charts";
import { Section } from "../utils";
import { subMonths } from "date-fns";
import { ActivityContextProvider } from "@/app/_components/time-range-selector/context";
import { RangeSelector } from "@/app/_components/time-range-selector/range-selector";
import { ActivityTimeframe } from "@/types/timeframes";
import { firstTransfer } from "@/services/cdp/facilitator/constants";

export const OverallStats = async () => {
  const endDate = new Date();
  const startDate = subMonths(endDate, 1);

  void api.stats.getOverallStatistics.prefetch({
    startDate,
    endDate,
  });
  void api.stats.getBucketedStatistics.prefetch({
    startDate,
    endDate,
    numBuckets: 16,
  });

  return (
    <HydrateClient>
      <ActivityContextProvider
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
      </ActivityContextProvider>
    </HydrateClient>
  );
};

export const LoadingEarnings = () => {
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
      <Card className="p-0 overflow-hidden relative flex-1">{children}</Card>
    </Section>
  );
};
