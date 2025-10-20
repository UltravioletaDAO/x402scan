import {
  BaseBarChart,
  LoadingBarChart,
} from '@/components/ui/charts/chart/bar';

import { api } from '@/trpc/server';

import type { ChartData } from '@/components/ui/charts/chart/types';

interface Props {
  agentConfigId: string;
}

const height = 32;

export const AgentCardChart: React.FC<Props> = async ({ agentConfigId }) => {
  const bucketedActivity =
    await api.public.agentConfigurations.getBucketedActivity({
      agentConfigurationId: agentConfigId,
    });

  const chartData: ChartData<{
    total_messages: number;
  }>[] = bucketedActivity.map(item => ({
    timestamp: item.bucket_start.toISOString(),
    total_messages: item.total_messages,
  }));

  return (
    <BaseBarChart
      data={chartData}
      bars={[
        {
          dataKey: 'total_messages',
          color: 'var(--primary)',
        },
      ]}
      height={height}
    />
  );
};

export const LoadingAgentCardChart = () => {
  return <LoadingBarChart height={height} />;
};
