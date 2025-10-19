import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/trpc/trpc';

import {
  getChatsByUserId,
  updateChat,
  deleteChat,
  updateChatSchema,
} from '@/services/db/chats';

export const userChatsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getChatsByUserId(ctx.session.user.id);
  }),

  update: protectedProcedure
    .input(updateChatSchema)
    .mutation(async ({ input, ctx }) => {
      return await updateChat(ctx.session.user.id, input);
    }),

  delete: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteChat(input.chatId, ctx.session.user.id);
    }),
});
