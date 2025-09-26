"use client";

import { LoadingMultiCharts, MultiCharts } from "@/components/ui/charts/multi";

import { api } from "@/trpc/client";

import { convertTokenAmount, formatTokenAmount } from "@/lib/token";

import type { ChartData } from "@/components/ui/charts/chart/types";

export const OverallCharts = () => {
  const [overallStats] = api.stats.getOverallStatistics.useSuspenseQuery({});
  const [bucketedStats] = api.stats.getBucketedStatistics.useSuspenseQuery({});

  const chartData: ChartData<{
    transactions: number;
    volume: number;
    buyers: number;
    sellers: number;
  }>[] = bucketedStats.map((stat) => ({
    transactions: Number(stat.total_transactions),
    volume: Number(convertTokenAmount(stat.total_amount)),
    buyers: Number(stat.unique_buyers),
    sellers: Number(stat.unique_sellers),
    timestamp: stat.week_start.toISOString(),
  }));

  return (
    <>
      <MultiCharts
        tabs={[
          {
            trigger: {
              value: "volume",
              label: "Volume",
              amount: formatTokenAmount(overallStats.total_amount),
            },
            items: {
              type: "area",
              areas: [
                {
                  dataKey: "volume",
                  color: "var(--color-primary)",
                },
              ],
            },
            tooltipRows: [
              {
                key: "volume",
                label: "Volume",
                getValue: (data) =>
                  data.toLocaleString(undefined, {
                    notation: "compact",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                    style: "currency",
                    currency: "USD",
                  }),
              },
            ],
          },
          {
            trigger: {
              value: "transactions",
              label: "Transactions",
              amount: overallStats.total_transactions.toLocaleString(
                undefined,
                {
                  notation: "compact",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }
              ),
            },
            items: {
              type: "bar",
              bars: [
                {
                  dataKey: "transactions",
                  color: "var(--color-primary)",
                },
              ],
            },
            tooltipRows: [
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
            ],
          },
          {
            trigger: {
              value: "buyers",
              label: "Buyers",
              amount: overallStats.unique_buyers.toLocaleString(undefined, {
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }),
            },
            items: {
              type: "bar",
              bars: [
                {
                  dataKey: "buyers",
                  color: "var(--color-primary)",
                },
              ],
            },
            tooltipRows: [
              {
                key: "buyers",
                label: "Buyers",
                getValue: (data) =>
                  data.toLocaleString(undefined, {
                    notation: "compact",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }),
              },
            ],
          },
          {
            trigger: {
              value: "sellers",
              label: "Sellers",
              amount: overallStats.unique_sellers.toLocaleString(undefined, {
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }),
            },
            items: {
              type: "bar",
              bars: [
                {
                  dataKey: "sellers",
                  color: "var(--color-primary)",
                },
              ],
            },
            tooltipRows: [
              {
                key: "sellers",
                label: "Sellers",
                getValue: (data) =>
                  data.toLocaleString(undefined, {
                    notation: "compact",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }),
              },
            ],
          },
        ]}
        chartData={chartData}
        height={300}
      />
    </>
  );
};

export const LoadingOverallCharts = () => {
  return (
    <LoadingMultiCharts
      tabs={[
        { type: "area", label: "Volume" },
        { type: "bar", label: "Transactions" },
        { type: "bar", label: "Buyers" },
        { type: "bar", label: "Sellers" },
      ]}
      height={300}
    />
  );
};
