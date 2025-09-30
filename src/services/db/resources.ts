import { prisma } from './client';

import type { FacilitatorResource } from '../cdp/facilitator/list-resources';
import { getOriginFromUrl } from '@/lib/url';
import { z } from 'zod';

export const upsertResource = async (
  facilitatorResource: FacilitatorResource
) => {
  const baseAccepts = facilitatorResource.accepts.find(
    accept => accept.network === 'base'
  );
  const origin = getOriginFromUrl(facilitatorResource.resource);
  if (!baseAccepts) return;
  return await prisma.$transaction(async tx => {
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
        origin: {
          connect: {
            origin,
          },
        },
      },
      update: {
        type: facilitatorResource.type,
        x402Version: facilitatorResource.x402Version,
        lastUpdated: facilitatorResource.lastUpdated,
        metadata: facilitatorResource.metadata,
        origin: {
          connect: {
            origin,
          },
        },
      },
    });

    const accepts = await tx.accepts.upsert({
      where: {
        resourceId_scheme_network: {
          resourceId: resource.id,
          scheme: baseAccepts.scheme,
          network: 'base',
        },
        payTo: baseAccepts.payTo.toLowerCase(),
      },
      create: {
        resourceId: resource.id,
        scheme: baseAccepts.scheme,
        description: baseAccepts.description,
        network: 'base',
        maxAmountRequired: BigInt(baseAccepts.maxAmountRequired),
        resource: resource.resource,
        mimeType: baseAccepts.mimeType,
        payTo: baseAccepts.payTo.toLowerCase(),
        maxTimeoutSeconds: baseAccepts.maxTimeoutSeconds,
        asset: baseAccepts.asset,
        outputSchema: baseAccepts.outputSchema,
        extra: baseAccepts.extra,
      },
      update: {
        description: baseAccepts.description,
        maxAmountRequired: BigInt(baseAccepts.maxAmountRequired),
        mimeType: baseAccepts.mimeType,
        payTo: baseAccepts.payTo.toLowerCase(),
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

export const getResourceByAddress = async (address: string) => {
  return await prisma.resources.findFirst({
    where: {
      accepts: {
        some: {
          payTo: address.toLowerCase(),
        },
      },
    },
  });
};

export const searchResourcesSchema = z.object({
  search: z.string(),
  limit: z.number().optional().default(10),
});

export const searchResources = async (
  input: z.input<typeof searchResourcesSchema>
) => {
  const { search, limit } = searchResourcesSchema.parse(input);
  return await prisma.resources.findMany({
    where: {
      OR: [
        {
          resource: {
            contains: search,
          },
        },
        {
          origin: {
            resources: {
              some: {
                accepts: {
                  some: {
                    payTo: search.toLowerCase(),
                  },
                },
              },
            },
          },
        },
        {
          metadata: {
            path: ['title', 'description'],
            string_contains: search,
          },
        },
      ],
    },
    take: limit,
  });
};
