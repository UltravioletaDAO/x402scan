import { api, HydrateClient } from "@/trpc/server";

import { Suspense } from "react";
import { Section } from "../utils";
import { KnownSellersTable, LoadingKnownSellersTable } from "./table";
import { Sorting, SortingProvider } from "../lib/sorting";
import { defaultSorting } from "../lib/defaults";
import { TimeRangeProvider } from "@/app/_components/time-range-selector/context";
import { firstTransfer } from "@/services/cdp/facilitator/constants";
import { subMonths } from "date-fns";
import { RangeSelector } from "@/app/_components/time-range-selector/range-selector";
import { ActivityTimeframe } from "@/types/timeframes";

export const TopServers = async () => {
  const endDate = new Date();
  const startDate = subMonths(endDate, 1);

  void api.sellers.list.bazaar.prefetch({
    sorting: defaultSorting,
    limit: 100,
    startDate,
    endDate,
  });
  void api.stats.getBazaarOverallStatistics.prefetch({
    startDate,
    endDate,
  });

  return (
    <HydrateClient>
      <SortingProvider>
        <TimeRangeProvider
          creationDate={firstTransfer}
          initialEndDate={endDate}
          initialStartDate={startDate}
          initialTimeframe={ActivityTimeframe.ThirtyDays}
        >
          <TopServersContainer>
            <Suspense fallback={<LoadingKnownSellersTable />}>
              <KnownSellersTable />
            </Suspense>
          </TopServersContainer>
        </TimeRangeProvider>
      </SortingProvider>
    </HydrateClient>
  );
};

export const LoadingTopServers = () => {
  return (
    <TopServersContainer>
      <LoadingKnownSellersTable />
    </TopServersContainer>
  );
};

const TopServersContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Section
      title="Top Servers"
      description="Top addresses that have received x402 transfers and are listed in the Bazaar"
      actions={
        <div className="flex items-center gap-2">
          <RangeSelector />
          <Sorting />
        </div>
      }
    >
      {children}
    </Section>
  );
};
