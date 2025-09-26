"use client";

import { BaseBarChart } from "@/components/ui/charts/chart/bar";
import { simulateChartData } from "@/components/ui/charts/chart/simulate";
import type { ChartData } from "@/components/ui/charts/chart/types";
import { use, useMemo } from "react";

interface Props {
  chartDataPromise: Promise<
    ChartData<{
      value: number;
    }>[]
  >;
}

export const KnownSellerChart = ({ chartDataPromise }: Props) => {
  const chartData = use(chartDataPromise);

  return (
    <BaseBarChart
      data={chartData}
      bars={[
        {
          dataKey: "value",
          color: "var(--color-primary)",
        },
      ]}
      height={100}
    />
  );
};

export const LoadingKnownSellerChart = () => {
  const data = useMemo(() => simulateChartData(), []);
  return (
    <BaseBarChart
      data={data}
      bars={[
        {
          dataKey: "value",
          color: "var(--color-neutral-500)",
        },
      ]}
      height={100}
    />
  );
};
