import { NextResponse } from "next/server";

import { upsertResource } from "@/services/db/resources";

import { listFacilitatorResources } from "@/services/cdp/facilitator/list-resources";

export const POST = async () => {
  const resources = await listFacilitatorResources();

  await Promise.all(
    resources.items.map(async (facilitatorResource) => {
      await upsertResource(facilitatorResource);
    })
  );

  return NextResponse.json({
    message: `Sync completed: processed ${resources.items.length} resources`,
  });
};
