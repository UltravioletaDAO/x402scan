import { NextResponse } from "next/server";

import { upsertResource } from "@/services/db/resources";

import { listFacilitatorResources } from "@/services/cdp/facilitator/list-resources";
import { scrapeOg } from "@/services/scraper/og";
import { scrapeMetadata } from "@/services/scraper/metadata";
import { upsertOrigin } from "@/services/db/origin";

import { getOriginFromUrl } from "@/lib/url";

export const POST = async () => {
  const resources = await listFacilitatorResources();

  const origins = new Set<string>();
  for (const resource of resources.items) {
    origins.add(getOriginFromUrl(resource.resource));
  }

  await Promise.all(
    Array.from(origins).map(async (origin) => {
      const [og, metadata] = await Promise.all([
        scrapeOg(origin),
        scrapeMetadata(origin),
      ]);
      await upsertOrigin({
        origin: origin,
        title: metadata?.title ?? og?.ogTitle,
        description: metadata?.description ?? og?.ogDescription,
        favicon:
          og?.favicon &&
          (og.favicon.startsWith("/")
            ? origin.replace(/\/$/, "") + og.favicon
            : og.favicon),
        ogImages:
          og?.ogImage?.map((image) => ({
            url: image.url,
            height: image.height,
            width: image.width,
            title: og.ogTitle,
            description: og.ogDescription,
          })) ?? [],
      });
    })
  );

  await Promise.all(
    resources.items.map(async (facilitatorResource) => {
      await upsertResource(facilitatorResource);
    })
  );

  return NextResponse.json({
    message: `Sync completed: processed ${resources.items.length} resources`,
  });
};
