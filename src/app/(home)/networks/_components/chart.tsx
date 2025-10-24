'use client';

import { useChain } from '@/app/_contexts/chain/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import type { ChartData } from '@/components/ui/charts/chart/types';
import { LoadingMultiCharts, MultiCharts } from '@/components/ui/charts/multi';
import type { Chain } from '@/types/chain';

import { formatTokenAmount } from '@/lib/token';
import { createTab, networks } from '@/lib/charts';
import { api } from '@/trpc/client';

type NetworkKey = `${Chain}-${'transactions' | 'amount'}`;

export const NetworksChart = () => {
  const { chain } = useChain();
  const { startDate, endDate } = useTimeRangeContext();

  const [bucketedNetworkData] =
    api.networks.bucketedStatistics.useSuspenseQuery({
      numBuckets: 48,
      startDate,
      endDate,
      chain,
    });
  const [overallData] = api.stats.getOverallStatistics.useSuspenseQuery({
    startDate,
    endDate,
    chain,
  });

  const chartData: ChartData<Record<NetworkKey, number>>[] =
    bucketedNetworkData.map(item => ({
      timestamp: item.bucket_start.toISOString(),
      ...Object.entries(item.networks).reduce(
        (acc, [network_name, network]) => ({
          ...acc,
          [`${network_name}-transactions`]: network.total_transactions,
          [`${network_name}-amount`]: network.total_amount,
        }),
        {} as Record<NetworkKey, number>
      ),
    }));

  const getValueHandler = (
    data: number,
    id: string,
    allData?: Record<NetworkKey, number>
  ) => {
    if (!allData) return '0.0%';
    const total = networks.reduce(
      (sum, network) =>
        sum + (allData[`${network.chain}-${id}` as NetworkKey] || 0),
      0
    );
    const percentage = total > 0 ? (data / total) * 100 : 0;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <MultiCharts
      chartData={chartData}
      tabs={[
        createTab<Record<NetworkKey, number>, typeof networks[number]>({
          label: 'Transactions',
          amount: overallData.total_transactions.toLocaleString(),
          items: networks,
          getKey: n => n.chain,
          getValue: (data: number, allData?: Record<NetworkKey, number>) =>
            getValueHandler(data, 'transactions', allData),
          stackOffset: 'expand',
        }),
        createTab<Record<NetworkKey, number>, typeof networks[number]>({
          label: 'Amount',
          amount: formatTokenAmount(BigInt(overallData.total_amount)),
          items: networks,
          getKey: n => n.chain,
          getValue: (data: number, allData?: Record<NetworkKey, number>) =>
            getValueHandler(data, 'amount', allData),
          stackOffset: 'expand',
        }),
      ]}
    />
  );
};

export const LoadingNetworksChart = () => {
  return (
    <LoadingMultiCharts
      tabs={[
        {
          type: 'bar',
          label: 'Transactions',
        },
        {
          type: 'bar',
          label: 'Amount',
        },
      ]}
    />
  );
};
