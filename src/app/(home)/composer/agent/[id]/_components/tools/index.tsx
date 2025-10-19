import { Favicon } from '@/app/_components/favicon';
import { Section } from '@/app/_components/layout/page-utils';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { RouterOutputs } from '@/trpc/client';
import { Wrench } from 'lucide-react';

interface Props {
  resources: RouterOutputs['public']['agentConfigurations']['get']['resources'];
}

export const Tools: React.FC<Props> = ({ resources }) => {
  return (
    <Section title="Tools" description="Tools available to the agent">
      <div className="flex flex-col gap-4">
        {resources.map(resource => (
          <Card key={resource.id}>
            <CardHeader>
              <div className="flex items-center gap-2 space-y-0">
                <Favicon url={resource.favicon} Fallback={Wrench} />
                <CardTitle>{resource.resource}</CardTitle>
              </div>
              <CardDescription>
                {resource.accepts[0].description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
};
