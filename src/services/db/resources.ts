import { prisma } from "./client";

import { FacilitatorResource } from "../cdp/facilitator/list-resources";

export const upsertResource = async (
  facilitatorResource: FacilitatorResource
) => {
  const baseAccepts = facilitatorResource.accepts.find(
    (accept) => accept.network === "base"
  );
  if (!baseAccepts) return;
  return await prisma.$transaction(async (tx) => {
    const resource = await tx.resources.upsert({
      where: {
        resource: facilitatorResource.resource,
      },
      create: {
        resource: facilitatorResource.resource,
        type: facilitatorResource.type,
        x402Version: facilitatorResource.x402Version,
        lastUpdated: facilitatorResource.lastUpdated,
        metadata: facilitatorResource.metadata,
      },
      update: {
        type: facilitatorResource.type,
        x402Version: facilitatorResource.x402Version,
        lastUpdated: facilitatorResource.lastUpdated,
        metadata: facilitatorResource.metadata,
      },
    });

    const accepts = await tx.accepts.upsert({
      where: {
        resourceId_scheme_network: {
          resourceId: resource.id,
          scheme: baseAccepts.scheme,
          network: "base",
        },
        payTo: baseAccepts.payTo,
      },
      create: {
        resourceId: resource.id,
        scheme: baseAccepts.scheme,
        description: baseAccepts.description,
        network: "base",
        maxAmountRequired: BigInt(baseAccepts.maxAmountRequired),
        resource: resource.resource,
        mimeType: baseAccepts.mimeType,
        payTo: baseAccepts.payTo,
        maxTimeoutSeconds: baseAccepts.maxTimeoutSeconds,
        asset: baseAccepts.asset,
        outputSchema: baseAccepts.outputSchema,
        extra: baseAccepts.extra,
      },
      update: {
        description: baseAccepts.description,
        maxAmountRequired: BigInt(baseAccepts.maxAmountRequired),
        mimeType: baseAccepts.mimeType,
        payTo: baseAccepts.payTo,
        maxTimeoutSeconds: baseAccepts.maxTimeoutSeconds,
        asset: baseAccepts.asset,
        outputSchema: baseAccepts.outputSchema,
        extra: baseAccepts.extra,
      },
    });

    return {
      resource,
      accepts,
    };
  });
};
