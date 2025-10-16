import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  getAllResourceTags,
  createResourceTag,
  createResourceTagSchema,
  assignTagToResource,
  unassignTagFromResource,
  assignTagToResourceSchema,
  getResourceTags,
} from '@/services/db/resource-tag';
import { z } from 'zod';

export const resourceTagsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await getAllResourceTags();
  }),

  getByResource: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      return await getResourceTags(input);
    }),

  create: publicProcedure
    .input(createResourceTagSchema)
    .mutation(async ({ input }) => {
      return await createResourceTag(input);
    }),

  assign: publicProcedure
    .input(assignTagToResourceSchema)
    .mutation(async ({ input }) => {
      return await assignTagToResource(input);
    }),

  unassign: publicProcedure
    .input(assignTagToResourceSchema)
    .mutation(async ({ input }) => {
      return await unassignTagFromResource(input);
    }),
});
