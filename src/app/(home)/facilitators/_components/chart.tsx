'use client';

import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import type { ChartData } from '@/components/ui/charts/chart/types';
import { LoadingMultiCharts, MultiCharts } from '@/components/ui/charts/multi';
import { facilitators } from '@/lib/facilitators';

import type { FacilitatorName } from '@/lib/facilitators';
import { formatTokenAmount } from '@/lib/token';
import { api } from '@/trpc/client';

type FacilitatorKey = `${FacilitatorName}-${'transactions' | 'amount'}`;

export const FacilitatorsChart = () => {
  const { startDate, endDate } = useTimeRangeContext();

  const [data] = api.facilitators.bucketedStatistics.useSuspenseQuery({
    numBuckets: 48,
    startDate,
    endDate,
  });

  const chartData: ChartData<Record<FacilitatorKey, number>>[] = data.map(
    item => ({
      timestamp: item.bucket_start.toISOString(),
      ...Object.entries(item.facilitators).reduce(
        (acc, [facilitator_name, facilitator]) => ({
          ...acc,
          [`${facilitator_name}-transactions`]: facilitator.total_transactions,
          [`${facilitator_name}-amount`]: facilitator.total_amount,
        }),
        {} as Record<FacilitatorKey, number>
      ),
    })
  );

  return (
    <MultiCharts
      chartData={chartData}
      tabs={[
        {
          trigger: {
            label: 'Transactions',
            value: 'transactions',
            amount: '100',
          },
          items: {
            type: 'bar',
            bars: facilitators.toReversed().map(f => ({
              dataKey: `${f.name}-transactions` as FacilitatorKey,
              name: f.name,
              color: f.color,
            })),
            solid: true,
          },
          tooltipRows: facilitators.toReversed().map(f => ({
            key: `${f.name}-transactions` as FacilitatorKey,
            label: f.name,
            getValue: (data: number) => data.toLocaleString(),
            labelClassName: 'text-xs font-mono',
            valueClassName: 'text-xs font-mono',
          })),
        },
        {
          trigger: {
            label: 'Amount',
            value: 'amount',
            amount: '100',
          },
          items: {
            type: 'bar',
            bars: facilitators.toReversed().map(f => ({
              dataKey: `${f.name}-amount` as FacilitatorKey,
              name: f.name,
              color: f.color,
            })),
            solid: true,
          },
          tooltipRows: facilitators.toReversed().map(f => ({
            key: `${f.name}-amount` as FacilitatorKey,
            label: f.name,
            getValue: (data: number) => formatTokenAmount(BigInt(data)),
            labelClassName: 'text-xs font-mono',
            valueClassName: 'text-xs font-mono',
          })),
        },
      ]}
    />
  );
};

export const LoadingFacilitatorsChart = () => {
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
