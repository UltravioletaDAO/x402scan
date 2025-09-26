import { api, HydrateClient } from "@/trpc/server";

import { Suspense } from "react";
import { KnownSellerCard } from "./card";
import { Section } from "../utils";

export const TopServers = async () => {
  const { items } = await api.sellers.list.bazaar({
    limit: 6,
    sorting: [{ id: "tx_count", desc: true }],
  });

  return (
    <HydrateClient>
      <Section
        title="Top Servers"
        description="Top addresses that have received x402 transfers and are listed in the Bazaar"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Suspense fallback={<p>Loading...</p>}>
            {items.map((item) => (
              <KnownSellerCard key={item.recipient} item={item} />
            ))}
          </Suspense>
        </div>
      </Section>
    </HydrateClient>
  );
};
