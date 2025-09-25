"use client";

import { ChartLineIcon } from "lucide-react";

import { BaseBarChart, type ChartData } from "@/components/ui/charts/bar-chart";

import { StatCard } from "../card";

interface Props {
  data: ChartData<{ buyers: number; sellers: number }>[];
}

export const BuyersSellersChart: React.FC<Props> = ({ data }) => {
  const format = (value: number) => {
    return value.toLocaleString(undefined, {
      notation: "compact",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
  };

  return (
    <StatCard
      label="Buyers / Sellers"
      Icon={ChartLineIcon}
      value={`${format(
        data.reduce((acc, curr) => acc + curr.buyers, 0)
      )} / ${format(data.reduce((acc, curr) => acc + curr.sellers, 0))}`}
    >
      <BaseBarChart
        data={data}
        bars={[
          { dataKey: "buyers", color: "var(--primary)" },
          { dataKey: "sellers", color: "var(--primary)" },
        ]}
        tooltipRows={[
          {
            key: "buyers",
            label: "Transactions",
            getValue: (value) => format(value),
          },
          {
            key: "sellers",
            label: "Sellers",
            getValue: (value) => format(value),
          },
        ]}
        height={"100%"}
        stacked={false}
      />
    </StatCard>
  );
};
