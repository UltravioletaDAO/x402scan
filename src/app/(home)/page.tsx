import { api, HydrateClient } from "@/trpc/server";
import { Body, Heading } from "../_components/layout/page-utils";

export default async function Home() {
  const topRecipients = await api.sellers.list({
    limit: 10,
    sortType: "total_amount",
  });
  console.log(topRecipients);
  return (
    <HydrateClient>
      <Heading title="Top Sellers" />
      <Body>
        <p>Test</p>
      </Body>
    </HydrateClient>
  );
}
