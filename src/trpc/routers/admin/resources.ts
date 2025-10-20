import z from 'zod';

import { adminProcedure, createTRPCRouter } from '../../trpc';

import {
  createTag,
  createTagSchema,
  assignTagToResource,
  unassignTagFromResource,
  assignTagToResourceSchema,
  unassignAllTagsFromResource,
  unassignAllTagsFromAllResources,
  deleteResourceTag,
} from '@/services/db/resources/tag';
import {
  createResourceRequestMetadata,
  createResourceRequestMetadataSchema,
  updateResourceRequestMetadata,
  updateResourceRequestMetadataSchema,
  getResourceRequestMetadata,
  getAllResourceRequestMetadata,
  deleteResourceRequestMetadata,
  searchResourcesForMetadata,
} from '@/services/db/resources/request-metadata';

export const adminResourcesRouter = createTRPCRouter({
  tags: {
    create: adminProcedure
      .input(createTagSchema)
      .mutation(async ({ input }) => {
        return await createTag(input);
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
  },
  requestMetadata: {
    list: adminProcedure.query(async () => {
      return await getAllResourceRequestMetadata();
    }),

    getByResource: adminProcedure.input(z.uuid()).query(async ({ input }) => {
      return await getResourceRequestMetadata(input);
    }),

    searchResources: adminProcedure
      .input(z.object({ search: z.string().optional() }))
      .query(async ({ input }) => {
        return await searchResourcesForMetadata(input.search);
      }),

    create: adminProcedure
      .input(createResourceRequestMetadataSchema)
      .mutation(async ({ input }) => {
        return await createResourceRequestMetadata(input);
      }),

    update: adminProcedure
      .input(updateResourceRequestMetadataSchema)
      .mutation(async ({ input }) => {
        return await updateResourceRequestMetadata(input);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.uuid() }))
      .mutation(async ({ input }) => {
        return await deleteResourceRequestMetadata(input.id);
      }),
  },
});
