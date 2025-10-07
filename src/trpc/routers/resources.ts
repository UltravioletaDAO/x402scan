import {
  getResourceByAddress,
  listResources,
  searchResources,
  searchResourcesSchema,
  upsertResource,
} from '@/services/db/resources';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { ethereumAddressSchema } from '@/lib/schemas';
import z from 'zod';
import { Methods } from '@/types/x402';
import { TRPCError } from '@trpc/server';
import { EnhancedX402ResponseSchema } from '@/lib/x402/schema';
import type { AcceptsNetwork } from '@prisma/client';

export const resourcesRouter = createTRPCRouter({
  list: {
    all: publicProcedure.query(async () => {
      return await listResources();
    }),
    byAddress: publicProcedure
      .input(ethereumAddressSchema)
      .query(async ({ input }) => {
        return await listResources({
          accepts: {
            some: {
              payTo: input.toLowerCase(),
            },
          },
        });
      }),
  },
  getResourceByAddress: publicProcedure
    .input(ethereumAddressSchema)
    .query(async ({ input }) => {
      return await getResourceByAddress(input);
    }),
  search: publicProcedure
    .input(searchResourcesSchema)
    .query(async ({ input }) => {
      return await searchResources(input);
    }),

  register: publicProcedure
    .input(
      z.object({
        url: z.url(),
        method: z.enum(Methods),
        headers: z.record(z.string(), z.string()).optional(),
        body: z.object().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // ping resource
      const response = await fetch(input.url, {
        method: input.method,
        headers: input.headers,
        body: input.body ? JSON.stringify(input.body) : undefined,
      });

      // if it doesn't respond with a 402, return error
      if (response.status !== 402) {
        return new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Resource did not respond with a 402',
        });
      }

      // parse the response
      const data = EnhancedX402ResponseSchema.safeParse(await response.json());
      if (!data.success) {
        return new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid x402 response',
        });
      }

      // upsert the resource
      await upsertResource({
        resource: input.url.toString(),
        type: 'http',
        x402Version: data.data.x402Version,
        lastUpdated: new Date(),
        accepts:
          data.data.accepts?.map(accept => ({
            ...accept,
            network: accept.network.replace('-', '_') as AcceptsNetwork,
            maxAmountRequired: accept.maxAmountRequired,
            outputSchema: accept.outputSchema,
            extra: accept.extra,
          })) ?? [],
      });

      return true;
    }),
});
