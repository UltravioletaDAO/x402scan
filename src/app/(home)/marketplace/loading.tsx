import { Body, Heading } from '@/app/_components/layout/page-utils';

import { LoadingOriginsCarousel } from './_components/carousel';
import { MARKETPLACE_CAROUSELS } from './carousels';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react';

export default function MarketplaceLoading() {
  return (
    <div>
      <Heading
        title="Marketplace"
        description="Explore the most popular x402 servers"
      />
      <Body>
        {MARKETPLACE_CAROUSELS.map((carousel, index) => (
          <Fragment key={carousel.sectionProps.title}>
            {index !== 0 && <Separator />}
            <LoadingOriginsCarousel sectionProps={carousel.sectionProps} />
          </Fragment>
        ))}
      </Body>
    </div>
  );
}
