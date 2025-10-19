import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/trpc/trpc';
import {
  getAgentConfigurationById,
  listAgentConfigurations,
} from '@/services/db/agent-config';
import {
  agentConfigBucketedActivityInputSchema,
  getAgentConfigBucketedActivity,
} from '@/services/db/agent-config/stats';
import { auth } from '@/auth';

export const publicAgentConfigurationsRouter = createTRPCRouter({
  get: publicProcedure.input(z.uuid()).query(async ({ input }) => {
    const session = await auth();
    return await getAgentConfigurationById(input, session?.user?.id);
  }),

  list: publicProcedure.query(async () => {
    return await listAgentConfigurations();
  }),

  getBucketedActivity: publicProcedure
    .input(agentConfigBucketedActivityInputSchema)
    .query(async ({ input }) => {
      return await getAgentConfigBucketedActivity(input);
    }),
});
