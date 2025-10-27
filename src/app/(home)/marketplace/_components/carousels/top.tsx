'use client';

import { OriginsCarousel } from './lib/carousel/client';

export const TopOrigins = () => {
  return (
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
  );
};
