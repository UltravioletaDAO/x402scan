"use client";

import { ChartLineIcon } from "lucide-react";

import { BaseBarChart, type ChartData } from "@/components/ui/charts/bar-chart";

import { StatCard } from "../card";

interface Props {
  data: ChartData<{ transactions: number }>[];
}

export const TransactionsChart: React.FC<Props> = ({ data }) => {
  const format = (value: number) => {
    return value.toLocaleString(undefined, {
      notation: "compact",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
  };

  return (
    <StatCard
      label="Transactions"
      Icon={ChartLineIcon}
      value={format(data.reduce((acc, curr) => acc + curr.transactions, 0))}
    >
      <BaseBarChart
        data={data}
        bars={[{ dataKey: "transactions", color: "var(--primary)" }]}
        tooltipRows={[
          {
            key: "transactions",
            label: "Transactions",
            getValue: (value) => format(value),
          },
        ]}
        height={"100%"}
      />
    </StatCard>
  );
};
