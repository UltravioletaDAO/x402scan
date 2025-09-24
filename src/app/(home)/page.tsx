import { Body, Heading } from "../_components/layout/page-utils";
import { TopSellers } from "./_components/top-sellers";
import { TopResources } from "./_components/top-resources";

export default async function Home() {
  return (
    <div>
      <Heading
        title="x402scan"
        description="See what's happening in the x402 ecosystem"
      />
      <Body>
        <TopSellers />
        <TopResources />
      </Body>
    </div>
  );
}
