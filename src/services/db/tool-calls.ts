import { prisma } from './client';

import type { Prisma } from '@prisma/client';

export const createToolCall = async (data: Prisma.ToolCallCreateInput) => {
  return await prisma.toolCall.create({
    data,
  });
};
