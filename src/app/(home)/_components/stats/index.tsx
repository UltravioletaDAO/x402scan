import { api } from "@/trpc/server";
import { CardContainer } from "./card";
import { VolumeChart } from "./charts/volume";
import { ChartLineIcon, DollarSign } from "lucide-react";
import { TransactionsChart } from "./charts/transactions";
import { convertTokenAmount } from "@/lib/token";

export const OverallStats = async () => {
  const stats = await api.stats.getBucketedStatistics();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardContainer title="Volume" Icon={DollarSign}>
        <VolumeChart
          values={stats.map((stat) => ({
            value: convertTokenAmount(stat.total_amount),
            date: stat.week_start,
          }))}
        />
      </CardContainer>
      <CardContainer title="Requests" Icon={ChartLineIcon}>
        <TransactionsChart
          values={stats.map((stat) => ({
            value: stat.total_transactions,
            date: stat.week_start,
          }))}
        />
      </CardContainer>
      {/* <OverallStatsCard
        title="Unique Buyers"
        values={stats.map((stat) => ({
          value: stat.unique_buyers,
          date: stat.week_start,
        }))}
        formatOptions={{
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        }}
      />
      <OverallStatsCard
        title="Unique Sellers"
        values={stats.map((stat) => ({
          value: stat.unique_sellers,
          date: stat.week_start,
        }))}
        formatOptions={{
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        }}
      /> */}
    </div>
  );
};
