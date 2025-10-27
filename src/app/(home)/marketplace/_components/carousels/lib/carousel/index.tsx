import { LoadingOriginsCarouselClient, OriginsCarouselClient } from './client';

import { api, HydrateClient } from '@/trpc/server';

import type { RouterInputs } from '@/trpc/client';
import type { SectionProps } from '@/app/_components/layout/page-utils';
import type { LucideIcon } from 'lucide-react';
import { Suspense } from 'react';

interface Props<T extends string> {
  sectionProps: Omit<SectionProps<T>, 'children' | 'actions'> & {
    Icon: LucideIcon;
  };
  input: RouterInputs['public']['sellers']['list']['bazaar'];
  hideCount?: boolean;
}

export const OriginsCarousel = async <T extends string>({
  sectionProps,
  input,
  hideCount,
}: Props<T>) => {
  await api.public.sellers.list.bazaar.prefetch(input);

  const { title, Icon, ...rest } = sectionProps;

  const titleComponent = (
    <div className="flex items-center gap-2">
      <Icon className="size-6" />
      <h1 className="font-bold text-xl md:text-2xl">{title}</h1>
    </div>
  );

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <LoadingOriginsCarouselClient
            title={titleComponent}
            sectionProps={rest}
          />
        }
      >
        <OriginsCarouselClient
          sectionProps={rest}
          input={input}
          hideCount={hideCount}
          title={titleComponent}
        />
      </Suspense>
    </HydrateClient>
  );
};

export const LoadingOriginsCarousel = async <T extends string>({
  sectionProps,
}: Omit<Props<T>, 'input' | 'hideCount'>) => {
  const { title, Icon, ...rest } = sectionProps;

  return (
    <LoadingOriginsCarouselClient
      title={
        <div className="flex items-center gap-2">
          <Icon className="size-6" />
          <h1 className="font-bold text-xl md:text-2xl">{title}</h1>
        </div>
      }
      sectionProps={rest}
    />
  );
};
