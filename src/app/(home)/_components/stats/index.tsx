import { api } from "@/trpc/server";
import { OverallStatsCard } from "./card";
import { formatTokenAmount } from "@/lib/token";

export const OverallStats = async () => {
  const stats = await api.stats.getOverallStatistics();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <OverallStatsCard
        title="Total Transactions"
        value={stats.total_transactions.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      />
      <OverallStatsCard
        title="Total Amount"
        value={formatTokenAmount(stats.total_amount)}
      />
      <OverallStatsCard
        title="Unique Buyers"
        value={stats.unique_buyers.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      />
      <OverallStatsCard
        title="Unique Sellers"
        value={stats.unique_sellers.toLocaleString(undefined, {
          notation: "compact",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}
      />
    </div>
  );
};
