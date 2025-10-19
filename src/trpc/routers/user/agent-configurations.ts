import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/trpc';
import {
  createAgentConfiguration,
  listAgentConfigurationsByUserId,
  updateAgentConfiguration,
  deleteAgentConfiguration,
  updateAgentConfigurationSchema,
} from '@/services/db/agent-config';
import { agentConfigurationSchema } from '@/services/db/agent-config/schema';

export const userAgentConfigurationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await listAgentConfigurationsByUserId(ctx.session.user.id);
  }),

  // Create a new agent configuration
  create: protectedProcedure
    .input(agentConfigurationSchema)
    .mutation(async ({ input, ctx }) => {
      return await createAgentConfiguration(ctx.session.user.id, input);
    }),

  // Update an existing agent configuration
  update: protectedProcedure
    .input(updateAgentConfigurationSchema)
    .mutation(async ({ input, ctx }) => {
      return await updateAgentConfiguration(ctx.session.user.id, input);
    }),

  // Delete an agent configuration
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteAgentConfiguration(input.id, ctx.session.user.id);
    }),
});
