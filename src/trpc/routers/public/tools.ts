import { createTRPCRouter, publicProcedure } from '../../trpc';

import { searchX402Tools } from '@/services/agent/search-tools';
import {
  listTopTools,
  listTopToolsSchema,
} from '@/services/db/composer/tool-call';
import { searchResourcesSchema } from '@/services/db/resources/resource';

export const publicToolsRouter = createTRPCRouter({
  search: publicProcedure
    .input(searchResourcesSchema)
    .query(async ({ input }) => {
      return await searchX402Tools(input);
    }),

  top: publicProcedure.input(listTopToolsSchema).query(async ({ input }) => {
    return await listTopTools(input);
  }),
});
