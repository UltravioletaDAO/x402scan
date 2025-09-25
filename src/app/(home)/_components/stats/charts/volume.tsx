"use client";

import { StatChartContent } from "./base";
import { BaseBarChart } from "@/components/ui/charts/bar-chart";

import type { ChartData } from "@/components/ui/charts/bar-chart";
import type { Value, StatChart } from "../types";

export const VolumeChart = ({ values }: { values: Value[] }) => {
  return (
    <StatChartContent
      values={values}
      Chart={VolumeChartContent}
      formatOptions={{
        notation: "compact",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        style: "currency",
        currency: "USD",
      }}
    />
  );
};

export const VolumeChartContent: StatChart = ({ values, format }) => {
  const data: ChartData<{ volume: number }>[] = values.map((value) => ({
    timestamp: value.date.toISOString(),
    volume: Number(value.value),
  }));

  return (
    <BaseBarChart
      data={data}
      bars={[{ dataKey: "volume", color: "var(--primary)" }]}
      tooltipRows={[
        {
          key: "volume",
          label: "Value",
          getValue: (value) => format(BigInt(value)),
        },
      ]}
      height={"100%"}
    />
  );
};
