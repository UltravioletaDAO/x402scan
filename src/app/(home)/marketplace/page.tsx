import { Body, Heading } from '@/app/_components/layout/page-utils';

import { api, HydrateClient } from '@/trpc/server';
import { OriginsCarousel } from './_components/carousels/lib/carousel/client';
import { Separator } from '@/components/ui/separator';

export default async function MarketplacePage() {
  await api.public.sellers.list.bazaar.prefetch({
    pagination: {
      page_size: 20,
    },
  });

  return (
    <HydrateClient>
      <Heading
        title="Marketplace"
        description="Explore the most popular x402 servers"
        className="md:max-w-[95%]"
      />
      <Body className="max-w-[95%]">
        <OriginsCarousel
          sectionProps={{
            title: 'Most Used',
          }}
          input={{
            pagination: {
              page_size: 20,
            },
          }}
        />
        <OriginsCarousel
          sectionProps={{
            title: 'Oldest',
          }}
          input={{
            sorting: {
              id: 'first_block_timestamp',
              desc: false,
            },
            pagination: {
              page_size: 20,
            },
          }}
          hideCount
        />
        <Separator />
        <OriginsCarousel
          sectionProps={{
            title: 'Newest',
          }}
          input={{
            sorting: {
              id: 'first_block_timestamp',
              desc: true,
            },
            pagination: {
              page_size: 20,
            },
          }}
          hideCount
        />
        <Separator />
        <OriginsCarousel
          sectionProps={{
            title: 'Search Servers',
          }}
          input={{
            tags: ['Search'],
            pagination: {
              page_size: 20,
            },
          }}
        />
        <Separator />
        <OriginsCarousel
          sectionProps={{
            title: 'Crypto Servers',
          }}
          input={{
            tags: ['Crypto'],
            pagination: {
              page_size: 20,
            },
          }}
        />
        <Separator />
        <OriginsCarousel
          sectionProps={{
            title: 'AI Servers',
          }}
          input={{
            tags: ['Utility'],
            pagination: {
              page_size: 20,
            },
          }}
        />
        <Separator />
        <OriginsCarousel
          sectionProps={{
            title: 'Trading Servers',
          }}
          input={{
            tags: ['Trading'],
            pagination: {
              page_size: 20,
            },
          }}
        />
      </Body>
    </HydrateClient>
  );
}
