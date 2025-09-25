import { api } from "@/trpc/server";
import { TransactionsChart } from "./charts/transactions";
import { VolumeChart } from "./charts/volume";
import { convertTokenAmount } from "@/lib/token";
import { BuyersSellersChart } from "./charts/buyers-sellers";

export const OverallStats = async () => {
  const stats = await api.stats.getBucketedStatistics();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TransactionsChart
        data={stats.map((stat) => ({
          transactions: Number(stat.total_transactions),
          timestamp: stat.week_start.toISOString(),
        }))}
      />
      <VolumeChart
        data={stats.map((stat) => ({
          volume: Number(convertTokenAmount(stat.total_amount)),
          timestamp: stat.week_start.toISOString(),
        }))}
      />
      <BuyersSellersChart
        data={stats.map((stat) => ({
          buyers: Number(stat.unique_buyers),
          sellers: Number(stat.unique_sellers),
          timestamp: stat.week_start.toISOString(),
        }))}
      />
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
