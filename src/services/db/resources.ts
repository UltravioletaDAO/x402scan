import { prisma } from './client';

import { getOriginFromUrl } from '@/lib/url';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ethereumAddressSchema } from '@/lib/schemas';
import type { EnhancedOutputSchema } from '@/lib/x402/schema';

export const upsertResourceSchema = z.object({
  resource: z.string(),
  type: z.enum(['http']),
  x402Version: z.number(),
  lastUpdated: z.date(),
  metadata: z.record(z.string(), z.any()).optional(),
  accepts: z.array(
    z.object({
      scheme: z.enum(['exact']),
      network: z.enum([
        'base_sepolia',
        'avalanche_fuji',
        'base',
        'sei',
        'sei_testnet',
        'avalanche',
        'iotex',
        'solana_devnet',
        'solana',
      ]),
      payTo: ethereumAddressSchema,
      description: z.string(),
      maxAmountRequired: z.string(),
      mimeType: z.string(),
      maxTimeoutSeconds: z.number(),
      asset: z.string(),
      outputSchema: z.custom<EnhancedOutputSchema>().optional(),
      extra: z.record(z.string(), z.any()).optional(),
    })
  ),
});

export const upsertResource = async (
  resourceInput: z.input<typeof upsertResourceSchema>
) => {
  const baseResource = upsertResourceSchema.parse(resourceInput);
  const baseAccepts = baseResource.accepts.find(
    accept => accept.network === 'base'
  );
  const originStr = getOriginFromUrl(baseResource.resource);
  if (!baseAccepts) return;
  return await prisma.$transaction(async tx => {
    const { origin, ...resource } = await tx.resources.upsert({
      where: {
        resource: baseResource.resource,
      },
      create: {
        resource: baseResource.resource,
        type: baseResource.type,
        x402Version: baseResource.x402Version,
        lastUpdated: baseResource.lastUpdated,
        metadata: baseResource.metadata,
        origin: {
          connectOrCreate: {
            where: {
              origin: originStr,
            },
            create: {
              origin: originStr,
            },
          },
        },
      },
      update: {
        type: baseResource.type,
        x402Version: baseResource.x402Version,
        lastUpdated: baseResource.lastUpdated,
        metadata: baseResource.metadata,
        origin: {
          connect: {
            origin: originStr,
          },
        },
      },
      include: {
        origin: true,
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
      origin,
    };
  });
};

export const listResources = async (where?: Prisma.ResourcesWhereInput) => {
  return await prisma.resources.findMany({
    where,
    include: {
      accepts: true,
    },
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
    include: {
      origin: true,
      accepts: true,
    },
    take: limit,
  });
};
