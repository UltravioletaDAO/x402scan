import z from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

import {
  getResourceByAddress,
  listResources,
  searchResources,
  searchResourcesSchema,
} from '@/services/db/resources';

import { ethereumAddressSchema } from '@/lib/schemas';

import { Methods } from '@/types/x402';

import { registerResource } from '@/lib/resources';

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
      let parseErrorData: {
        parseErrors: string[];
        data: unknown;
      } | null = null;

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

        const data = (await response.json()) as unknown;

        const result = await registerResource(input.url.toString(), data);

        if (result.success === false) {
          if (result.error.type === 'parseResponse') {
            parseErrorData = {
              data: result.data,
              parseErrors: result.error.parseErrors,
            };
            continue;
          } else {
            return result;
          }
        }

        return result;
      }

      if (parseErrorData) {
        return {
          success: false as const,
          data: parseErrorData.data,
          error: {
            type: 'parseErrors' as const,
            parseErrors: parseErrorData.parseErrors,
          },
        };
      }

      return {
        success: false as const,
        error: {
          type: 'no402' as const,
        },
        type: 'no402' as const,
      };
    }),
});
