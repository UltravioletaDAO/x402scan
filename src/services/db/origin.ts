import { prisma } from './client';

import { z } from 'zod';

const ogImageSchema = z.object({
  url: z.url(),
  height: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const originSchema = z.object({
  origin: z.url(),
  title: z.string().optional(),
  description: z.string().optional(),
  favicon: z.url().optional(),
  ogImages: z.array(ogImageSchema),
});

export const upsertOrigin = async (
  originInput: z.input<typeof originSchema>
) => {
  const origin = originSchema.parse(originInput);
  return await prisma.resourceOrigin.upsert({
    where: { origin: origin.origin },
    update: {
      title: origin.title,
      description: origin.description,
      favicon: origin.favicon,
      ogImages: {
        upsert: origin.ogImages.map(
          ({ url, height, width, title, description }) => ({
            where: {
              url,
            },
            create: {
              url,
              height,
              width,
              title,
              description,
            },
            update: {
              height,
              width,
              title,
              description,
            },
          })
        ),
      },
    },
    create: {
      origin: origin.origin,
      title: origin.title,
      description: origin.description,
      favicon: origin.favicon,
      ogImages: {
        create: origin.ogImages.map(
          ({ url, height, width, title, description }) => ({
            url,
            height,
            width,
            title,
            description,
          })
        ),
      },
    },
  });
};

export const getOriginsByAddress = async (address: string) => {
  return await prisma.resourceOrigin.findMany({
    where: {
      resources: {
        some: {
          accepts: {
            some: {
              payTo: address.toLowerCase(),
            },
          },
        },
      },
    },
  });
};

export const searchOriginsSchema = z.object({
  search: z.string(),
  limit: z.number().optional().default(10),
});

export const searchOrigins = async (
  input: z.input<typeof searchOriginsSchema>
) => {
  const { search, limit } = searchOriginsSchema.parse(input);
  return await prisma.resourceOrigin.findMany({
    where: {
      origin: {
        contains: search,
      },
    },
    include: {
      resources: {
        include: {
          accepts: {
            select: {
              payTo: true,
            },
          },
        },
      },
    },
    take: limit,
  });
};
