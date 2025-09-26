import React, { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { Card } from "@/components/ui/card";

import { api, HydrateClient } from "@/trpc/server";

import { OverallCharts, LoadingOverallCharts } from "./charts";
import { Section } from "../utils";

export const OverallStats = async () => {
  void api.stats.getOverallStatistics.prefetch({});
  void api.stats.getBucketedStatistics.prefetch({});

  return (
    <HydrateClient>
      <ActivityContainer>
        <ErrorBoundary
          fallback={<p>There was an error loading the activity data</p>}
        >
          <Suspense fallback={<LoadingOverallCharts />}>
            <OverallCharts />
          </Suspense>
        </ErrorBoundary>
      </ActivityContainer>
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
    >
      <Card className="p-0 overflow-hidden relative flex-1">{children}</Card>
    </Section>
  );
};
