import React from 'react';

import { Server } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Addresses } from '@/components/ui/address';
import { Avatar } from '@/components/ui/avatar';

import { FacilitatorStats, LoadingFacilitatorStats } from './stats';

import { cn } from '@/lib/utils';

import type { Facilitator } from '@/lib/facilitators';
import type { RouterOutputs } from '@/trpc/client';

interface Props {
  facilitator: Facilitator;
  stats: NonNullable<RouterOutputs['facilitators']['list']>[number];
}

export const FacilitatorCard: React.FC<Props> = async ({
  facilitator,
  stats,
}) => {
  return (
    <Card className={cn('relative mt-5 md:mt-6')}>
      <Card className="absolute top-0 left-4 -translate-y-1/2 size-10 md:size-12 flex items-center justify-center border rounded-md overflow-hidden">
        <Avatar
          src={facilitator.image}
          className="size-full border-none rounded-none"
          fallback={<Server className="size-8" />}
        />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-7">
        <div className="flex flex-col gap-4 p-4 md:pt-8 col-span-5">
          <div className="">
            <h1 className="text-lg font-bold break-words line-clamp-2 leading-tight">
              {facilitator.name}
            </h1>
            <Addresses addresses={facilitator.addresses} className="text-xs" />
          </div>
          {/* Chart Here */}
        </div>
        <div className="col-span-2">
          <FacilitatorStats stats={stats} />
        </div>
      </div>
    </Card>
  );
};

export const LoadingFacilitatorCard = () => {
  return (
    <Card className={cn('relative mt-10 md:mt-12 mb-12')}>
      <Card className="absolute top-0 left-4 -translate-y-1/2 size-12 md:size-16 flex items-center justify-center border rounded-md overflow-hidden">
        <Avatar
          src={undefined}
          className="size-full"
          fallback={<Skeleton className="size-8" />}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-7">
        <div className="flex flex-col gap-4 p-4 pt-8 md:pt-10 col-span-5">
          <div className="">
            <Skeleton className="w-36 h-[30px] my-[3px]" />
            <Skeleton className="w-64 h-[16px] my-[4px]" />
          </div>
        </div>
        <div className="col-span-2 overflow-hidden">
          <LoadingFacilitatorStats />
        </div>
      </div>
    </Card>
  );
};
