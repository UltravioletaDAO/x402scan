"use client";

import { LoadingMultiCharts, MultiCharts } from "@/components/ui/charts/multi";

import { api } from "@/trpc/client";

import { convertTokenAmount, formatTokenAmount } from "@/lib/token";

import type { ChartData } from "@/components/ui/charts/chart/types";
import { useActivityContext } from "@/app/_components/time-range-selector/context";
import { differenceInSeconds, subSeconds } from "date-fns";
import { getPercentageFromBigInt } from "@/lib/utils";

export const OverallCharts = () => {
  const { startDate, endDate } = useActivityContext();

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
    numBuckets: 16,
    startDate,
    endDate,
  });

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
      <MultiCharts
        tabs={[
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
              changePercentage: getPercentageFromBigInt(
                previousOverallStats.total_transactions,
                overallStats.total_transactions
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
              value: "volume",
              label: "Volume",
              amount: formatTokenAmount(overallStats.total_amount),
              changePercentage: getPercentageFromBigInt(
                previousOverallStats.total_amount,
                overallStats.total_amount
              ),
            },
            items: {
              type: "area",
              areas: [
                {
                  dataKey: "totalAmount",
                  color: "var(--color-primary)",
                },
              ],
            },
            tooltipRows: [
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
              changePercentage: getPercentageFromBigInt(
                previousOverallStats.unique_buyers,
                overallStats.unique_buyers
              ),
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
              changePercentage: getPercentageFromBigInt(
                previousOverallStats.unique_sellers,
                overallStats.unique_sellers
              ),
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
