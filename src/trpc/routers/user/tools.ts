import {
  fetchFreepikMysticTask,
  fetchFreepikMysticTaskInputSchema,
} from '@/services/tools/freepik';
import { createTRPCRouter, protectedProcedure } from '../../trpc';

export const userToolsRouter = createTRPCRouter({
  freepik: {
    getTask: protectedProcedure
      .input(fetchFreepikMysticTaskInputSchema)
      .query(async ({ input }) => {
        return await fetchFreepikMysticTask(input);
      }),
  },
});
