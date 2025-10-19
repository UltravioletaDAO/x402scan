import z from 'zod';

import { prisma } from '../client';

import type { createAgentConfigurationSchema } from './schema';

// AgentConfiguration CRUD operations
export const createAgentConfiguration = async (
  userId: string,
  data: z.infer<typeof createAgentConfigurationSchema>
) => {
  const {
    name,
    model,
    systemPrompt,
    visibility,
    resourceIds,
    image,
    description,
  } = data;
  return await prisma.agentConfiguration.create({
    data: {
      name,
      model,
      systemPrompt,
      visibility,
      image,
      description,
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

export const getAgentConfigurationById = async (
  id: string,
  userId?: string
) => {
  return await prisma.agentConfiguration.findUnique({
    where: {
      id,
      OR: [
        { ownerId: userId },
        { users: { some: { userId } } },
        { visibility: 'public' },
      ],
    },
    include: {
      resources: {
        select: {
          resource: {
            select: {
              id: true,
              origin: {
                select: {
                  favicon: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const listAgentConfigurations = async () => {
  return await prisma.agentConfiguration.findMany({
    orderBy: { users: { _count: 'desc' } },
  });
};

export const listAgentConfigurationsByUserId = async (userId: string) => {
  return await prisma.agentConfiguration.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateAgentConfigurationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  visibility: z.enum(['public', 'private']).optional(),
  resourceIds: z.array(z.uuid()).optional(),
});

export const updateAgentConfiguration = async (
  userId: string,
  updateData: z.infer<typeof updateAgentConfigurationSchema>
) => {
  const { id, ...data } = updateData;
  return await prisma.agentConfiguration.update({
    where: { id, ownerId: userId },
    data,
  });
};

export const deleteAgentConfiguration = async (id: string, userId: string) => {
  return await prisma.agentConfiguration.delete({
    where: { id, ownerId: userId },
  });
};

// Additional utility functions
// export const getPublicAgentConfigurations = async () => {
//   return await prisma.agentConfiguration.findMany({
//     where: { visibility: 'public' },
//     orderBy: { createdAt: 'desc' },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });
// };

// export const getAgentConfigurationsByUserIdAndVisibility = async (
//   userId: string,
//   visibility: 'public' | 'private'
// ) => {
//   return await prisma.agentConfiguration.findMany({
//     where: {
//       userId,
//       visibility,
//     },
//     orderBy: { createdAt: 'desc' },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });
// };
