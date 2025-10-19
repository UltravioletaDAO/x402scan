import { Favicon } from '@/app/_components/favicon';
import { Section } from '@/app/_components/layout/page-utils';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatTokenAmount } from '@/lib/token';
import type { RouterOutputs } from '@/trpc/client';
import { Activity, Wrench } from 'lucide-react';

interface Props {
  resources: RouterOutputs['public']['agentConfigurations']['get']['resources'];
}

export const Tools: React.FC<Props> = ({ resources }) => {
  return (
    <Section title="Tools" description="Tools available to the agent">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources.map(resource => (
          <Card key={resource.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 space-y-0">
                  <Favicon url={resource.favicon} Fallback={Wrench} />
                  <CardTitle>{resource.resource} </CardTitle>
                  <span className="text-sm font-mono text-primary font-bold">
                    {formatTokenAmount(
                      BigInt(resource.accepts[0].maxAmountRequired)
                    )}
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
        ))}
      </div>
    </Section>
  );
};
