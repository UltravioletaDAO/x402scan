import { Body } from '../../_components/layout/page-utils';

import { Banner } from './_components/banner';
import { HomeHeading } from './_components/heading';
import { OverallStats } from './_components/stats';
import { TopServers } from './_components/sellers/known-sellers';
import { TopFacilitators } from './_components/top-facilitators';
import { LatestTransactions } from './_components/latest-transactions';
import { AllSellers } from './_components/sellers/all-sellers';
import { ComposerCallout } from './_components/composer-callout';

export default async function Home() {
  return (
    <div>
      <div className="-mt-6 md:-mt-8 mb-6 md:mb-8">
        <Banner />
      </div>
      <HomeHeading />
      <Body>
        <ComposerCallout />
        <OverallStats />
        <TopServers />
        <TopFacilitators />
        <LatestTransactions />
        <AllSellers />
      </Body>
    </div>
  );
}
