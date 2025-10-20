import { Body } from '../../_components/layout/page-utils';

import { Banner } from './_components/banner';
import { HomeHeading } from './_components/heading';
import { ComposerCallout } from './_components/composer-callout';
import { LoadingTopServers } from './_components/sellers/known-sellers';
import { LoadingTopFacilitators } from './_components/top-facilitators';
import { LoadingOverallStats } from './_components/stats';
import { LoadingLatestTransactions } from './_components/latest-transactions';
import { LoadingAllSellers } from './_components/sellers/all-sellers';

export default function LoadingOverview() {
  return (
    <div>
      <div className="-mt-6 md:-mt-8 mb-6 md:mb-8">
        <Banner />
      </div>
      <HomeHeading />
      <Body>
        <ComposerCallout />
        <LoadingOverallStats />
        <LoadingTopServers />
        <LoadingTopFacilitators />
        <LoadingLatestTransactions />
        <LoadingAllSellers />
      </Body>
    </div>
  );
}
