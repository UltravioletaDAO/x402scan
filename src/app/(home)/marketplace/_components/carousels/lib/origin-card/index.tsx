import Link from 'next/link';

import { DollarSign, Activity, Users } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Favicon } from '@/app/_components/favicon';

import { FooterStat, LoadingFooterStat } from './stat';

import { convertTokenAmount } from '@/lib/token';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  origin: RouterOutputs['public']['sellers']['list']['bazaar']['items'][number];
}

export const OriginCard: React.FC<Props> = ({ origin }) => {
  const originWithMetadata =
    origin.origins.find(o => o.favicon) ?? origin.origins[0];

  return (
    <Link
      href={`/origin/${originWithMetadata.id}`}
      prefetch={false}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:border-primary transition-colors cursor-pointer group">
        <div className="flex flex-row items-start gap-2 flex-1">
          <CardHeader className="w-full overflow-hidden">
            <div className="flex gap-2 items-center">
              <Favicon
                url={originWithMetadata.favicon}
                className="size-6 shrink-0"
              />
              <div className="flex-1 overflow-hidden">
                <CardTitle className="font-bold text-sm md:text-base truncate group-hover:text-primary transition-colors">
                  {originWithMetadata.title ?? 'No Title'}
                </CardTitle>
                <p className="text-[10px] md:text-xs text-muted-foreground truncate font-mono">
                  {originWithMetadata.origin}
                </p>
              </div>
            </div>
            <CardDescription className="text-muted-foreground text-xs md:text-sm line-clamp-2">
              {originWithMetadata?.description ?? 'No description'}
            </CardDescription>
          </CardHeader>
        </div>
        <CardFooter className="grid grid-cols-3 gap-2">
          <FooterStat
            Icon={Activity}
            value={Number(origin.tx_count)}
            className="text-primary font-bold"
          />
          <FooterStat
            Icon={DollarSign}
            value={convertTokenAmount(BigInt(origin.total_amount))}
            className="justify-center"
          />
          <FooterStat
            Icon={Users}
            value={Number(origin.unique_buyers)}
            className="justify-end"
          />
        </CardFooter>
      </Card>
    </Link>
  );
};

export const LoadingOriginCard = () => {
  return (
    <Card className="h-full flex flex-col hover:border-primary transition-colors cursor-pointer group">
      <div className="flex flex-row items-start gap-2 flex-1">
        <CardHeader className="w-full overflow-hidden">
          <div className="flex gap-2 items-center">
            <Skeleton className="size-6 shrink-0" />
            <div className="flex-1 overflow-hidden">
              <Skeleton className="w-24 h-[16px] md:h-[18px]" />
              <Skeleton className="w-full h-[12px] md:h-[14px]" />
            </div>
          </div>
          <Skeleton className="w-full h-[12px] md:h-[14px]" />
        </CardHeader>
      </div>
      <CardFooter className="grid grid-cols-3 gap-2">
        <LoadingFooterStat Icon={Activity} className="text-primary font-bold" />
        <LoadingFooterStat Icon={DollarSign} className="justify-center" />
        <LoadingFooterStat Icon={Users} className="justify-end" />
      </CardFooter>
    </Card>
  );
};
