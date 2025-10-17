import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';
import {
  getAllResourceTags,
  createResourceTag,
  createResourceTagSchema,
  assignTagToResource,
  unassignTagFromResource,
  assignTagToResourceSchema,
  getResourceTags,
  unassignAllTagsFromResource,
  unassignAllTagsFromAllResources,
  deleteResourceTag,
} from '@/services/db/resource-tag';
import { z } from 'zod';

export const resourceTagsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await getAllResourceTags();
  }),

  getByResource: publicProcedure.input(z.uuid()).query(async ({ input }) => {
    return await getResourceTags(input);
  }),

  create: adminProcedure
    .input(createResourceTagSchema)
    .mutation(async ({ input }) => {
      return await createResourceTag(input);
    }),

  assign: adminProcedure
    .input(assignTagToResourceSchema)
    .mutation(async ({ input }) => {
      return await assignTagToResource(input);
    }),

  unassign: adminProcedure
    .input(assignTagToResourceSchema)
    .mutation(async ({ input }) => {
      return await unassignTagFromResource(input);
    }),

  unassignAll: adminProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      return await unassignAllTagsFromResource(input);
    }),

  unassignAllFromAll: adminProcedure.mutation(async () => {
    return await unassignAllTagsFromAllResources();
  }),

  delete: adminProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      return await deleteResourceTag(input);
    }),
});
