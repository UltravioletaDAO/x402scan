import { api, HydrateClient } from "@/trpc/server";
import { Body, Heading } from "../_components/layout/page-utils";
import { TopSellers } from "./_components/top-sellers";

const defaultSorting = [
  { id: "tx_count" as const, desc: true },
  { id: "total_amount" as const, desc: true },
  { id: "latest_block_timestamp" as const, desc: true },
];
const limit = 100;

export default async function Home() {
  void api.sellers.list.prefetchInfinite({
    sorting: defaultSorting,
    limit,
  });
  return (
    <HydrateClient>
      <Heading title="Top Sellers" />
      <Body>
        <TopSellers defaultSorting={defaultSorting} limit={limit} />
      </Body>
    </HydrateClient>
  );
}
