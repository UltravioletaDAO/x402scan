"use client";

import { DollarSign } from "lucide-react";

import { BaseAreaChart } from "@/components/ui/charts/area-chart";

import { StatCard } from "../card";

import type { ChartData } from "@/components/ui/charts/bar-chart";

interface Props {
  data: ChartData<{ volume: number }>[];
}

export const VolumeChart = ({ data }: Props) => {
  const format = (value: number) => {
    return value.toLocaleString(undefined, {
      notation: "compact",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      style: "currency",
      currency: "USD",
    });
  };
  return (
    <StatCard
      label="Volume"
      Icon={DollarSign}
      value={format(data.reduce((acc, curr) => acc + curr.volume, 0))}
    >
      <BaseAreaChart
        data={data}
        areas={[{ dataKey: "volume", color: "var(--primary)" }]}
        tooltipRows={[
          {
            key: "volume",
            label: "Value",
            getValue: (value) => format(value),
          },
        ]}
        height={"100%"}
      />
    </StatCard>
  );
};
