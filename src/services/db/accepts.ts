import { unstable_cache } from 'next/cache';
import type { ResourceOrigin } from '@prisma/client';
import { prisma } from './client';
import { mixedAddressSchema } from '@/lib/schemas';

const getAcceptsAddressesUncached = async () => {
  const accepts = await prisma.accepts.findMany({
    include: {
      resourceRel: {
        select: {
          origin: true,
          _count: true,
        },
      },
    },
  });

  return accepts
    .filter(accept => mixedAddressSchema.safeParse(accept.payTo).success)
    .reduce(
      (acc, accept) => {
        if (!accept.payTo) {
          return acc;
        }
        if (acc[accept.payTo]) {
          const existingOrigin = acc[accept.payTo].find(
            origin => origin.id === accept.resourceRel.origin.id
          );
          if (!existingOrigin) {
            acc[accept.payTo].push(accept.resourceRel.origin);
          }
        } else {
          acc[accept.payTo] = [accept.resourceRel.origin];
        }
        return acc;
      },
      {} as Record<string, Array<ResourceOrigin>>
    );
};

export const getAcceptsAddresses = async () => {
  return await unstable_cache(
    getAcceptsAddressesUncached,
    ['accepts-addresses'],
    {
      revalidate: 300, // 5 minutes - this data doesn't change often
      tags: ['accepts'],
    }
  )();
};

export const listAccepts = async () => {
  return await prisma.accepts.findMany({
    select: {
      id: true,
      resource: true,
      outputSchema: true,
      scheme: true,
      network: true,
      description: true,
      payTo: true,
      asset: true,
    },
    orderBy: {
      resource: 'asc',
    },
  });
};
