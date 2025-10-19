import { Activity, Wrench } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Favicon } from '@/app/_components/favicon';

import { formatTokenAmount } from '@/lib/token';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  resource: RouterOutputs['public']['agentConfigurations']['get']['resources'][number];
}

export const ToolCard: React.FC<Props> = ({ resource }) => {
  return (
    <Card key={resource.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 space-y-0">
            <Favicon url={resource.favicon} Fallback={Wrench} />
            <CardTitle>{resource.resource} </CardTitle>
            <span className="text-sm font-mono text-primary font-bold">
              {formatTokenAmount(BigInt(resource.accepts[0].maxAmountRequired))}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Activity className="size-3" />
            <p className="text-sm text-muted-foreground">
              {resource.usageCount}
            </p>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {resource.accepts[0].description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
