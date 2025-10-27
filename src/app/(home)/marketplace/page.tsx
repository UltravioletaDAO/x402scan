import { Body, Heading } from '@/app/_components/layout/page-utils';

import { api, HydrateClient } from '@/trpc/server';
import { OriginsCarousel } from './_components/carousels/lib/carousel/client';

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
        description="Buy and sell resources on the x402 marketplace"
        className="md:max-w-[95%]"
      />
      <Body className="max-w-[95%]">
        <OriginsCarousel
          sectionProps={{
            title: 'Top Servers',
            description: 'The most popular origins on the marketplace',
          }}
          input={{
            pagination: {
              page_size: 20,
            },
          }}
        />
        <OriginsCarousel
          sectionProps={{
            title: 'Search Tools',
            description: 'Servers that provide search services',
          }}
          input={{
            tags: ['Search'],
            pagination: {
              page_size: 20,
            },
          }}
        />
        <OriginsCarousel
          sectionProps={{
            title: 'Crypto Tools',
            description: 'Servers that provide crypto services',
          }}
          input={{
            tags: ['Crypto'],
            pagination: {
              page_size: 20,
            },
          }}
        />
        <OriginsCarousel
          sectionProps={{
            title: 'AI Tools',
            description: 'Servers that provide AI services',
          }}
          input={{
            tags: ['Utility'],
            pagination: {
              page_size: 20,
            },
          }}
        />
        <OriginsCarousel
          sectionProps={{
            title: 'Trading Tools',
            description: 'Servers that provide trading services',
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
