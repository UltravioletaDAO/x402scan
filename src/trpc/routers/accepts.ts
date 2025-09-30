import { createTRPCRouter, publicProcedure } from '../trpc';
import { prisma } from '@/services/db/client';

export const acceptsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
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
  }),
});
