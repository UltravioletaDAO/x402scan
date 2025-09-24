import { api, HydrateClient } from "@/trpc/server";
import { Body, Heading } from "../_components/layout/page-utils";
import { TopSellers } from "./_components/top-sellers";

export default async function Home() {
  void api.sellers.list.prefetchInfinite({});
  return (
    <HydrateClient>
      <Heading title="Top Sellers" />
      <Body>
        <TopSellers />
      </Body>
    </HydrateClient>
  );
}
