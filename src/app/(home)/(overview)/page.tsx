import { Body, Heading } from "../../_components/layout/page-utils";
import { TopSellers } from "./_components/tables/top-sellers";
import { TopResources } from "./_components/tables/top-resources";
import { OverallStats } from "./_components/stats";
import { Suspense } from "react";
import { TopServers } from "./_components/known-sellers";

export default async function Home() {
  return (
    <div>
      <Heading
        title="x402scan"
        description="See what's happening in the x402 ecosystem"
      />
      <Body>
        <Suspense fallback={<div>Loading...</div>}>
          <OverallStats />
        </Suspense>
        <TopServers />
        <TopResources />
        <TopSellers />
      </Body>
    </div>
  );
}
