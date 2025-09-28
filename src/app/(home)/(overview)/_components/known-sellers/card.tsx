import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import type { ChartData } from "@/components/ui/charts/chart/types";
import { convertTokenAmount } from "@/lib/token";
import { cn, formatAddress } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/client";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import { Origins, OriginsSkeleton } from "./origins";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { knownSellerMetrics } from "./data";
import { BaseBarChart } from "@/components/ui/charts/chart/bar";

interface Props {
  item: RouterOutputs["sellers"]["list"]["bazaar"]["items"][number];
}

export const KnownSellerCard: React.FC<Props> = async ({ item }) => {
  const chartData: ChartData<{
    tx_count: number;
    total_amount: number;
    unique_buyers: number;
  }>[] = await api.stats
    .getBucketedStatistics({
      addresses: [item.recipient],
    })
    .then((stats) =>
      stats.map((stat) => ({
        tx_count: Number(stat.total_transactions),
        total_amount: Number(convertTokenAmount(stat.total_amount)),
        unique_buyers: Number(stat.unique_buyers),
        timestamp: stat.bucket_start.toISOString(),
      }))
    );

  return (
    <Tabs defaultValue={knownSellerMetrics[0].value}>
      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h1 className="font-medium font-mono">
              {formatAddress(item.recipient)}
            </h1>
            <TabsList className="bg-transparent p-0 gap-2">
              {knownSellerMetrics.map((value) => (
                <TabsTrigger
                  key={value.value}
                  value={value.value}
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary cursor-pointer hover:text-primary/80",
                    "p-0 size-fit gap-1 font-mono"
                  )}
                >
                  <value.Icon className="size-3" />
                  {value.format(item[value.value])}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </CardHeader>
        {knownSellerMetrics.map((value) => (
          <TabsContent key={value.value} value={value.value}>
            <BaseBarChart
              data={chartData}
              bars={[
                {
                  dataKey: value.value,
                  color: "var(--color-primary)",
                },
              ]}
              height={100}
            />
          </TabsContent>
        ))}
        <CardFooter className="px-0 pt-4 overflow-hidden max-w-full">
          <Suspense fallback={<OriginsSkeleton />}>
            <Origins address={item.recipient} />
          </Suspense>
        </CardFooter>
      </Card>
    </Tabs>
  );
};
