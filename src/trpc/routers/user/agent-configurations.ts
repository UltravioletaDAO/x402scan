import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/trpc';
import {
  createAgentConfiguration,
  listAgentConfigurationsByUserId,
  updateAgentConfiguration,
  deleteAgentConfiguration,
  updateAgentConfigurationSchema,
  joinAgentConfiguration,
  leaveAgentConfiguration,
  getAgentConfigurationUser,
} from '@/services/db/agent-config';
import { agentConfigurationSchema } from '@/services/db/agent-config/schema';

export const userAgentConfigurationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await listAgentConfigurationsByUserId(ctx.session.user.id);
  }),

  create: protectedProcedure
    .input(agentConfigurationSchema)
    .mutation(async ({ input, ctx }) => {
      return await createAgentConfiguration(ctx.session.user.id, input);
    }),

  update: protectedProcedure
    .input(updateAgentConfigurationSchema)
    .mutation(async ({ input, ctx }) => {
      return await updateAgentConfiguration(ctx.session.user.id, input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteAgentConfiguration(input.id, ctx.session.user.id);
    }),

  join: protectedProcedure.input(z.uuid()).mutation(async ({ input, ctx }) => {
    return await joinAgentConfiguration(ctx.session.user.id, input);
  }),

  leave: protectedProcedure.input(z.uuid()).mutation(async ({ input, ctx }) => {
    return await leaveAgentConfiguration(ctx.session.user.id, input);
  }),

  isMember: protectedProcedure.input(z.uuid()).query(async ({ input, ctx }) => {
    return Boolean(await getAgentConfigurationUser(ctx.session.user.id, input));
  }),
});
