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
import { formatTokenAmount } from '@/lib/token';

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
        headers: z.record(z.string(), z.string()).optional(),
        body: z.object().optional(),
      })
    )
    .mutation(async ({ input }) => {
      for (const method of [Methods.GET, Methods.POST]) {
        // ping resource
        const response = await fetch(input.url, {
          method,
          headers: input.headers,
          body: input.body ? JSON.stringify(input.body) : undefined,
        });

        // if it doesn't respond with a 402, return error
        if (response.status !== 402) {
          continue;
        }

        // parse the response
        const data = EnhancedX402ResponseSchema.safeParse(
          await response.json()
        );
        if (!data.success) {
          continue;
        }

        // upsert the resource
        const resource = await upsertResource({
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

        if (!resource) {
          continue;
        }

        return {
          ...resource,
          accepts: {
            ...resource.accepts,
            maxAmountRequired: formatTokenAmount(
              resource.accepts.maxAmountRequired
            ),
          },
        };
      }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Resource did not respond with a valid x402 response',
      });
    }),
});
