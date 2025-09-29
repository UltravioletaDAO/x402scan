"use client";

import { api } from "@/trpc/client";

import { differenceInSeconds, subSeconds } from "date-fns";

import { useTimeRangeContext } from "@/app/_components/time-range-selector/context";

import { LoadingOverallStatsCard, OverallStatsCard } from "./card";

import { getPercentageFromBigInt } from "@/lib/utils";
import { convertTokenAmount, formatTokenAmount } from "@/lib/token";

import type { ChartData } from "@/components/ui/charts/chart/types";
import { ActivityTimeframe } from "@/types/timeframes";

export const OverallCharts = () => {
  const { startDate, endDate, timeframe } = useTimeRangeContext();

  const [overallStats] = api.stats.getOverallStatistics.useSuspenseQuery({
    startDate,
    endDate,
  });
  const [previousOverallStats] =
    api.stats.getOverallStatistics.useSuspenseQuery({
      startDate: subSeconds(startDate, differenceInSeconds(endDate, startDate)),
      endDate: startDate,
    });
  const [bucketedStats] = api.stats.getBucketedStatistics.useSuspenseQuery({
    numBuckets: 32,
    startDate,
    endDate,
  });

  console.log(bucketedStats);

  const chartData: ChartData<{
    transactions: number;
    totalAmount: number;
    buyers: number;
    sellers: number;
  }>[] = bucketedStats.map((stat) => ({
    transactions: Number(stat.total_transactions),
    totalAmount: parseFloat(convertTokenAmount(stat.total_amount).toString()),
    buyers: Number(stat.unique_buyers),
    sellers: Number(stat.unique_sellers),
    timestamp: stat.bucket_start.toISOString(),
  }));

  return (
    <>
      <OverallStatsCard
        title="Volume"
        value={formatTokenAmount(overallStats.total_amount)}
        percentageChange={
          timeframe === ActivityTimeframe.AllTime
            ? undefined
            : getPercentageFromBigInt(
                previousOverallStats.total_amount,
                overallStats.total_amount
              )
        }
        items={{
          type: "area",
          areas: [{ dataKey: "totalAmount", color: "var(--color-primary)" }],
        }}
        data={chartData}
        tooltipRows={[
          {
            key: "totalAmount",
            label: "Volume",
            getValue: (data) =>
              data.toLocaleString(undefined, {
                notation: "compact",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                style: "currency",
                currency: "USD",
              }),
          },
        ]}
      />
      <OverallStatsCard
        title="Transactions"
        value={overallStats.total_transactions.toLocaleString(undefined, {
          notation: "compact",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
        percentageChange={
          timeframe === ActivityTimeframe.AllTime
            ? undefined
            : getPercentageFromBigInt(
                previousOverallStats.total_transactions,
                overallStats.total_transactions
              )
        }
        items={{
          type: "bar",
          bars: [{ dataKey: "transactions", color: "var(--color-primary)" }],
        }}
        data={chartData}
        tooltipRows={[
          {
            key: "transactions",
            label: "Transactions",
            getValue: (data) =>
              data.toLocaleString(undefined, {
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }),
          },
        ]}
      />
      <OverallStatsCard
        title="Buyers"
        value={overallStats.unique_buyers.toLocaleString(undefined, {
          notation: "compact",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
        percentageChange={
          timeframe === ActivityTimeframe.AllTime
            ? undefined
            : getPercentageFromBigInt(
                previousOverallStats.unique_buyers,
                overallStats.unique_buyers
              )
        }
        items={{
          type: "bar",
          bars: [{ dataKey: "buyers", color: "var(--color-primary)" }],
        }}
        data={chartData}
        tooltipRows={[
          {
            key: "buyers",
            label: "Buyers",
            getValue: (data) =>
              data.toLocaleString(undefined, {
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
          },
        ]}
      />
      <OverallStatsCard
        title="Sellers"
        value={overallStats.unique_sellers.toLocaleString(undefined, {
          notation: "compact",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
        percentageChange={
          timeframe === ActivityTimeframe.AllTime
            ? undefined
            : getPercentageFromBigInt(
                previousOverallStats.unique_sellers,
                overallStats.unique_sellers
              )
        }
        items={{
          type: "bar",
          bars: [{ dataKey: "sellers", color: "var(--color-primary)" }],
        }}
        data={chartData}
        tooltipRows={[
          {
            key: "sellers",
            label: "Sellers",
            getValue: (data) =>
              data.toLocaleString(undefined, {
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
          },
        ]}
      />
    </>
  );
};

export const LoadingOverallCharts = () => {
  return (
    <>
      <LoadingOverallStatsCard type="area" title="Volume" />
      <LoadingOverallStatsCard type="bar" title="Transactions" />
      <LoadingOverallStatsCard type="bar" title="Buyers" />
      <LoadingOverallStatsCard type="bar" title="Sellers" />
    </>
  );
};
