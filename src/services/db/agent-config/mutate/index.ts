import z from 'zod';

import { prisma } from '../../client';

import { agentConfigurationSchema } from './schema';

export const createAgentConfigurationSchema = agentConfigurationSchema;

export const createAgentConfiguration = async (
  userId: string,
  input: z.infer<typeof agentConfigurationSchema>
) => {
  const { resourceIds, ...data } = input;
  return await prisma.agentConfiguration.create({
    data: {
      ...data,
      owner: {
        connect: { id: userId },
      },
      users: {
        create: {
          user: {
            connect: { id: userId },
          },
        },
      },
      resources: {
        createMany: {
          data: resourceIds.map(resourceId => ({
            resourceId,
          })),
        },
      },
    },
  });
};

export const updateAgentConfigurationSchema = agentConfigurationSchema
  .partial()
  .extend({
    id: z.string(),
  });

export const updateAgentConfiguration = async (
  userId: string,
  updateData: z.infer<typeof updateAgentConfigurationSchema>
) => {
  const { id, resourceIds, ...data } = updateData;
  return await prisma.agentConfiguration.update({
    where: { id, ownerId: userId },
    data: {
      ...data,
      resources: {
        deleteMany: {},
        createMany: {
          data: resourceIds?.map(resourceId => ({ resourceId })) ?? [],
        },
      },
    },
  });
};

export const deleteAgentConfiguration = async (id: string, userId: string) => {
  return await prisma.agentConfiguration.delete({
    where: { id, ownerId: userId },
  });
};

export const joinAgentConfiguration = async (
  userId: string,
  agentConfigurationId: string
) => {
  return await prisma.agentConfigurationUser.create({
    data: {
      userId,
      agentConfigurationId,
    },
  });
};

export const getAgentConfigurationUser = async (
  userId: string,
  agentConfigurationId: string
) => {
  return await prisma.agentConfigurationUser.findUnique({
    where: { userId_agentConfigurationId: { userId, agentConfigurationId } },
  });
};

export const leaveAgentConfiguration = async (
  userId: string,
  agentConfigurationId: string
) => {
  return await prisma.agentConfigurationUser.delete({
    where: { userId_agentConfigurationId: { userId, agentConfigurationId } },
  });
};
