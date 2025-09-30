import { Body, HeadingContainer } from '../../_components/layout/page-utils';
import { LoadingTopSellers } from './_components/top-sellers';
import { LoadingOverallStats } from './_components/stats';
import { LoadingTopServers } from './_components/known-sellers';
import { LoadingLatestTransactions } from './_components/latest-transactions';
import { SearchButtonContent } from './_components/search-button';

export default function LoadingOverview() {
  return (
    <div>
      <HeadingContainer className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-4xl font-bold font-mono">x402scan</h1>
          <p className="text-muted-foreground text-sm">
            The x402 analytics dashboard and block explorer
          </p>
        </div>
        <SearchButtonContent />
      </HeadingContainer>
      <Body>
        <LoadingOverallStats />
        <LoadingTopServers />
        <LoadingLatestTransactions />
        <LoadingTopSellers />
      </Body>
    </div>
  );
}
