import { Body, Heading } from "../../_components/layout/page-utils";
import { TopSellers } from "./_components/tables/top-sellers";
import { TopResources } from "./_components/tables/top-resources";
import { OverallStats } from "./_components/stats";
import { Suspense } from "react";

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
        <TopResources />
        <TopSellers />
      </Body>
    </div>
  );
}
