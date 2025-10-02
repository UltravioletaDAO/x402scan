import { api } from '@/trpc/server';

import { BaseAreaChart } from '@/components/ui/charts/chart/area';

import type { Facilitator } from '@/lib/facilitators';
import type { ChartData } from '@/components/ui/charts/chart/types';

interface Props {
  facilitator: Facilitator;
  total_transactions: number;
}

export const FacilitatorChart: React.FC<Props> = async ({
  facilitator,
  total_transactions,
}) => {
  const bucketedStats = await api.stats.getBucketedStatistics({
    numBuckets: 48,
    facilitators: facilitator.addresses,
  });

  const chartData: ChartData<{
    total_transactions: number;
  }>[] = bucketedStats.map(stat => ({
    timestamp: stat.bucket_start.toISOString(),
    total_transactions: Number(stat.total_transactions),
  }));

  return (
    <BaseAreaChart
      data={chartData}
      areas={[{ dataKey: 'total_transactions', color: 'var(--color-primary)' }]}
      height={'100%'}
      dataMax={total_transactions / 48}
    />
  );
};
