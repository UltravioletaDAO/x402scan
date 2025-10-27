'use client';

import { useCallback } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import { Button } from '@/components/ui/button';

import { Section } from '@/app/_components/layout/page-utils';

import { OriginCard } from '../origin-card';

import { api } from '@/trpc/client';

import { cn } from '@/lib/utils';

import type { RouterInputs } from '@/trpc/client';
import type { SectionProps } from '@/app/_components/layout/page-utils';
import { Badge } from '@/components/ui/badge';

interface Props<T extends string> {
  sectionProps: Omit<SectionProps<T>, 'children' | 'actions'>;
  input: RouterInputs['public']['sellers']['list']['bazaar'];
  hideCount?: boolean;
}

export const OriginsCarousel = <T extends string>({
  sectionProps,
  input,
  hideCount,
}: Props<T>) => {
  const [{ items, total_count }] =
    api.public.sellers.list.bazaar.useSuspenseQuery(input);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      slidesToScroll: 1,
      dragFree: true,
      containScroll: 'trimSnaps',
      dragThreshold: 10,
      watchDrag: true,
    },
    [WheelGesturesPlugin()]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <Section
      {...sectionProps}
      title={
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl md:text-2xl">
            {sectionProps.title}
          </h1>
          {!hideCount && <Badge variant="secondary">{total_count}</Badge>}
        </div>
      }
      actions={
        <div className="flex items-center border rounded-md divide-x">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="size-8"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="size-8"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2 md:gap-4">
          {items.map(origin => (
            <div
              key={`${origin.origins.map(o => o.origin).join(',')}`}
              className={cn(
                'flex-[0_0_66.666%]',
                'sm:flex-[0_0_40%]',
                'md:flex-[0_0_28.571%]',
                'lg:flex-[0_0_22.222%]',
                'xl:flex-[0_0_18.182%]',
                'min-w-0'
              )}
            >
              <OriginCard origin={origin} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
