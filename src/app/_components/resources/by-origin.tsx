'use client';

import Link from 'next/link';

import { OriginCard } from '@/app/_components/resources/origin';
import { ResourceExecutor } from './executor';

import { getBazaarMethod } from './executor/utils';

import { api } from '@/trpc/client';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Plus, ServerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useChain } from '@/app/_contexts/chain/hook';

interface Props {
  emptyText: string;
}

export const ResourcesByOrigin: React.FC<Props> = ({ emptyText }) => {
  const { chain } = useChain();

  const [originsWithResources] =
    api.origins.list.withResources.useSuspenseQuery({ chain });

  // Log all origins whose first resource has no accepts or empty accepts array
  console.log(
    originsWithResources.filter(origin =>
      origin.resources.some(
        resource => !resource.accepts || resource.accepts.length === 0
      )
    )
  );

  if (originsWithResources.length === 0) {
    return (
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ServerOff />
            </EmptyMedia>
            <EmptyTitle>No Resources</EmptyTitle>
            <EmptyDescription>{emptyText}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/resources/register">
              <Button variant="turbo">
                <Plus className="size-4" />
                Register Resource
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      {originsWithResources.map((origin, index) => (
        <div key={origin.id}>
          <OriginCard origin={origin} />
          <div className="pl-4">
            {origin.resources.map(resource => (
              <div key={resource.id} className="pt-4 pl-4 border-l relative">
                <div className="absolute left-0 top-[calc(2rem+10px)] w-4 h-[1px] bg-border" />
                <ResourceExecutor
                  resource={resource}
                  bazaarMethod={getBazaarMethod(
                    resource.accepts[0].outputSchema
                  )}
                  className="bg-transparent"
                  response={resource.data}
                />
              </div>
            ))}
            {index < originsWithResources.length - 1 ? (
              <div className="h-4 w-[1px] bg-border" />
            ) : (
              <div className="size-3 bg-border rounded-full -ml-[5px]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
