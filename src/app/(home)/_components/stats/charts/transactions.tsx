"use client";

import { StatChartContent } from "./base";
import { BaseAreaChart } from "@/components/ui/charts/area-chart";

import type { ChartData } from "@/components/ui/charts/bar-chart";
import type { Value, StatChart } from "../types";

export const TransactionsChart = ({ values }: { values: Value[] }) => {
  return <StatChartContent values={values} Chart={TransactionsChartContent} />;
};

export const TransactionsChartContent: StatChart = ({ values, format }) => {
  const data: ChartData<{ transactions: number }>[] = values.map((value) => ({
    timestamp: value.date.toISOString(),
    transactions: Number(value.value),
  }));

  return (
    <BaseAreaChart
      data={data}
      areas={[{ dataKey: "transactions", color: "var(--primary)" }]}
      tooltipRows={[
        {
          key: "transactions",
          label: "Value",
          getValue: (value) => format(BigInt(value)),
        },
      ]}
      height={"100%"}
    />
  );
};
