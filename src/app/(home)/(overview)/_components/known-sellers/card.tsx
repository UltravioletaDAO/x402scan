import { Card, CardHeader } from "@/components/ui/card";
import type { ChartData } from "@/components/ui/charts/chart/types";
import { convertTokenAmount, formatTokenAmount } from "@/lib/token";
import { formatAddress } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/client";
import { api } from "@/trpc/server";

interface Props {
  item: RouterOutputs["sellers"]["list"]["bazaar"]["items"][number];
}

export const KnownSellerCard: React.FC<Props> = async ({ item }) => {
  const bucketedStats = await api.stats.getBucketedStatistics({
    addresses: [item.recipient],
  });

  const chartData: ChartData<{
    volume: number;
    transactions: number;
    buyers: number;
  }>[] = bucketedStats.map((stat) => ({
    transactions: Number(stat.total_transactions),
    volume: Number(convertTokenAmount(stat.total_amount)),
    buyers: Number(stat.unique_buyers),
    timestamp: stat.week_start.toISOString(),
  }));

  return (
    <Card>
      <CardHeader className="space-y-0 flex flex-row justify-between">
        <h1 className="text-sm font-medium font-mono">
          {formatAddress(item.recipient)}
        </h1>
        <div className="flex flex-row gap-2">
          <p className="text-sm text-muted-foreground">
            {item.tx_count.toLocaleString(undefined, {
              notation: "compact",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatTokenAmount(item.total_amount)}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
};
