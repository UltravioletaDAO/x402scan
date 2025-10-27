import { OriginsCarousel } from './lib/carousel/client';

export const SearchOrigins = () => {
  return (
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
  );
};
