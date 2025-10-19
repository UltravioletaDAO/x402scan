import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/trpc/trpc';

import { getAgentConfiguration } from '@/services/db/agent-config/get';
import { listTopAgentConfigurations } from '@/services/db/agent-config/list';
import {
  agentConfigBucketedActivityInputSchema,
  getAgentConfigBucketedActivity,
} from '@/services/db/agent-config/stats';

import { auth } from '@/auth';

export const publicAgentConfigurationsRouter = createTRPCRouter({
  get: publicProcedure.input(z.uuid()).query(async ({ input }) => {
    const session = await auth();
    return await getAgentConfiguration(input, session?.user?.id);
  }),

  list: publicProcedure.query(async () => {
    return await listTopAgentConfigurations();
  }),

  getBucketedActivity: publicProcedure
    .input(agentConfigBucketedActivityInputSchema)
    .query(async ({ input }) => {
      return await getAgentConfigBucketedActivity(input);
    }),
});
