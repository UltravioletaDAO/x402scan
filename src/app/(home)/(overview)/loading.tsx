import { Body, Heading } from '../../_components/layout/page-utils';
import { LoadingTopSellers } from './_components/top-sellers';
import { LoadingOverallStats } from './_components/stats';
import { LoadingTopServers } from './_components/known-sellers';
import { LoadingLatestTransactions } from './_components/latest-transactions';

export default function LoadingOverview() {
  return (
    <div>
      <Heading
        title="x402scan"
        description="See what's happening in the x402 ecosystem"
      />
      <Body>
        <LoadingOverallStats />
        <LoadingTopServers />
        <LoadingLatestTransactions />
        <LoadingTopSellers />
      </Body>
    </div>
  );
}
