import { Body, Heading } from '../../_components/layout/page-utils';
import { TopSellers } from './_components/top-sellers';
import { OverallStats } from './_components/stats';
import { TopServers } from './_components/known-sellers';
import { LatestTransactions } from './_components/transactions';

export default async function Home() {
  return (
    <div>
      <Heading
        title="x402scan"
        description="See what's happening in the x402 ecosystem"
      />
      <Body>
        <OverallStats />
        <TopServers />
        <LatestTransactions />
        <TopSellers />
      </Body>
    </div>
  );
}
