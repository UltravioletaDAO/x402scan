import { BotMessageSquare, MessagesSquare, Users } from 'lucide-react';

import Link from 'next/link';

import { Favicons } from '@/app/_components/favicon';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  agentConfiguration: RouterOutputs['public']['agentConfigurations']['list'][number];
}

export const AgentCard: React.FC<Props> = ({ agentConfiguration }) => {
  return (
    <Link href={`/composer/agent/${agentConfiguration.id}`}>
      <Card className="justify-between flex flex-col hover:border-primary transition-colors">
        <CardHeader>
          <div className="flex flex-row items-center gap-3">
            {agentConfiguration.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agentConfiguration.image}
                alt={agentConfiguration.name}
                className="size-5 rounded object-cover bg-muted"
              />
            ) : (
              <BotMessageSquare className="size-5" />
            )}
            <CardTitle>{agentConfiguration.name}</CardTitle>
          </div>
          <CardDescription>
            {agentConfiguration.description ?? 'No description'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between text-sm">
          <div className="flex flex-row items-center gap-2 text-sm">
            <Favicons
              favicons={agentConfiguration.resources.map(
                resource => resource.originFavicon ?? null
              )}
              iconContainerClassName="size-5 bg-card"
            />
            <span className="text-muted-foreground">
              {agentConfiguration.resources.length} tool
              {agentConfiguration.resources.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center gap-1">
              <Users className="size-3" />
              <span className="text-muted-foreground">
                {agentConfiguration.user_count}
              </span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <MessagesSquare className="size-3" />
              <span className="text-muted-foreground">
                {agentConfiguration.message_count}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
