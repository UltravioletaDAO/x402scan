'use client';

import { useChain } from '@/app/_contexts/chain/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import type { ChartData } from '@/components/ui/charts/chart/types';
import { LoadingMultiCharts, MultiCharts } from '@/components/ui/charts/multi';
import { Chain, CHAIN_LABELS, CHAIN_ICONS } from '@/types/chain';

import { formatTokenAmount } from '@/lib/token';
import { api } from '@/trpc/client';

type NetworkKey = `${Chain}-${'transactions' | 'amount'}`;

const NETWORK_COLORS: Record<Chain, string> = {
  [Chain.BASE]: 'hsl(221, 83%, 53%)',
  [Chain.SOLANA]: 'hsl(271, 100%, 71%)',
  [Chain.POLYGON]: 'hsl(272, 55%, 50%)',
  [Chain.OPTIMISM]: 'hsl(0, 91%, 71%)',
};

const networks = Object.values(Chain).map(chain => ({
  chain,
  name: CHAIN_LABELS[chain],
  icon: CHAIN_ICONS[chain],
  color: NETWORK_COLORS[chain],
}));

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

  return (
    <MultiCharts
      chartData={chartData}
      tabs={[
        {
          trigger: {
            label: 'Transactions',
            value: 'transactions',
            amount: overallData.total_transactions.toLocaleString(),
          },
          items: {
            type: 'bar',
            bars: networks.toReversed().map(n => ({
              dataKey: `${n.chain}-transactions` as NetworkKey,
              name: n.name,
              color: n.color,
            })),
            solid: true,
            stackOffset: 'expand',
          },
          tooltipRows: networks.map(n => ({
            key: `${n.chain}-transactions` as NetworkKey,
            label: n.name,
            getValue: (data: number, allData?: Record<NetworkKey, number>) => {
              if (!allData) return '0.0%';
              const total = networks.reduce(
                (sum, network) =>
                  sum +
                  (allData[`${network.chain}-transactions` as NetworkKey] || 0),
                0
              );
              const percentage = total > 0 ? (data / total) * 100 : 0;
              return `${percentage.toFixed(1)}%`;
            },
            labelClassName: 'text-xs font-mono',
            valueClassName: 'text-xs font-mono',
            dotColor: n.color,
          })),
        },
        {
          trigger: {
            label: 'Amount',
            value: 'amount',
            amount: formatTokenAmount(BigInt(overallData.total_amount)),
          },
          items: {
            type: 'bar',
            bars: networks.toReversed().map(n => ({
              dataKey: `${n.chain}-amount` as NetworkKey,
              name: n.name,
              color: n.color,
            })),
            solid: true,
          },
          tooltipRows: networks.map(n => ({
            key: `${n.chain}-amount` as NetworkKey,
            label: n.name,
            getValue: (data: number, allData?: Record<NetworkKey, number>) => {
              if (!allData) return '0.0%';
              const total = networks.reduce(
                (sum, network) =>
                  sum + (allData[`${network.chain}-amount` as NetworkKey] || 0),
                0
              );
              const percentage = total > 0 ? (data / total) * 100 : 0;
              return `${percentage.toFixed(1)}%`;
            },
            labelClassName: 'text-xs font-mono',
            valueClassName: 'text-xs font-mono',
            dotColor: n.color,
          })),
        },
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
