import z from 'zod';

import { prisma } from '../client';
import { queryRaw } from '../query';

import { agentConfigurationSchema } from './schema';

import { Prisma } from '@prisma/client';

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

export const getAgentConfigurationById = async (
  id: string,
  userId?: string
) => {
  const [agentConfiguration] = await queryRaw(
    Prisma.sql`
    SELECT 
      ac.id,
      ac.name,
      ac.description,
      ac.image,
      ac."systemPrompt",
      ac.visibility,
      ac."createdAt",
      ac."updatedAt",
      ac."ownerId",
      ac.model,
      COALESCE(user_counts.user_count, 0) as "userCount",
      COALESCE(message_counts.message_count, 0) as "messageCount",
      COALESCE(tool_call_counts.tool_call_count, 0) as "toolCallCount",
      COALESCE(
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'id', r.id,
            'resource', r.resource,
            'favicon', o.favicon,
            'usageCount', COALESCE(resource_usage_counts.usage_count, 0),
            'accepts', (
              SELECT JSON_AGG(
                JSONB_BUILD_OBJECT(
                  'description', a2.description,
                  'maxAmountRequired', a2."maxAmountRequired"
                )
              )
              FROM "Accepts" a2
              WHERE a2."resourceId" = r.id
            )
          )
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) AS resources
    FROM "AgentConfiguration" ac
    LEFT JOIN (
      SELECT 
        "agentConfigurationId",
        COUNT(*) as user_count
      FROM "AgentUser"
      GROUP BY "agentConfigurationId"
    ) user_counts ON ac.id = user_counts."agentConfigurationId"
    LEFT JOIN (
      SELECT 
        acu."agentConfigurationId",
        COUNT(m."Message") as message_count
      FROM "Chat" c
      LEFT JOIN "AgentUser" acu ON c."userAgentConfigurationId" = acu.id
      LEFT JOIN "Message" m ON c.id = m."chatId"
      WHERE c."userAgentConfigurationId" IS NOT NULL
      GROUP BY acu."agentConfigurationId"
    ) message_counts ON ac.id = message_counts."agentConfigurationId"
    LEFT JOIN (
      SELECT 
        acu."agentConfigurationId",
        COUNT(tc.id) as tool_call_count
      FROM "Chat" c
      LEFT JOIN "AgentUser" acu ON c."userAgentConfigurationId" = acu.id
      LEFT JOIN "ToolCall" tc ON c.id = tc."chatId"
      WHERE c."userAgentConfigurationId" IS NOT NULL
      GROUP BY acu."agentConfigurationId"
    ) tool_call_counts ON ac.id = tool_call_counts."agentConfigurationId"
    LEFT JOIN "AgentConfigurationResource" acr ON acr."agentConfigurationId" = ac.id
    LEFT JOIN "Resources" r ON acr."resourceId" = r.id
    LEFT JOIN "ResourceOrigin" o ON r."originId" = o.id
    LEFT JOIN (
      SELECT 
        tc."resourceId",
        COUNT(tc.id) as usage_count
      FROM "ToolCall" tc
      LEFT JOIN "Chat" c ON tc."chatId" = c.id
      LEFT JOIN "AgentUser" acu ON c."userAgentConfigurationId" = acu.id
      WHERE c."userAgentConfigurationId" IS NOT NULL
      GROUP BY tc."resourceId"
    ) resource_usage_counts ON r.id = resource_usage_counts."resourceId"
    WHERE ac.id = ${id}
    AND (
      ac."ownerId" = ${userId} 
      OR EXISTS (
        SELECT 1 FROM "AgentUser" au 
        WHERE au."agentConfigurationId" = ac.id 
        AND au."userId" = ${userId}
      ) 
      OR ac.visibility = 'public'
    )
    GROUP BY
      ac.id,
      ac.name,
      ac.description,
      ac.image,
      ac."systemPrompt",
      ac.visibility,
      ac."createdAt",
      ac."updatedAt",
      ac.model,
      user_counts.user_count,
      message_counts.message_count,
      tool_call_counts.tool_call_count
  `,
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        ownerId: z.string(),
        description: z.string().nullable(),
        image: z.string().nullable(),
        systemPrompt: z.string(),
        visibility: z.enum(['public', 'private']),
        createdAt: z.date(),
        updatedAt: z.date(),
        model: z.string().nullable(),
        userCount: z.bigint(),
        messageCount: z.bigint(),
        toolCallCount: z.bigint(),
        resources: z.array(
          z.object({
            id: z.string(),
            resource: z.string(),
            favicon: z.url().nullable(),
            usageCount: z.number(),
            accepts: z.array(
              z.object({
                description: z.string(),
                maxAmountRequired: z.number(),
              })
            ),
          })
        ),
      })
    )
  );

  return agentConfiguration;
};

export const listAgentConfigurations = async () => {
  const agentConfigurations = await queryRaw(
    Prisma.sql`
      SELECT 
        ac.id,
        ac.name,
        ac.description,
        ac.image,
        ac."systemPrompt",
        ac.visibility,
        ac."createdAt",
        COUNT(DISTINCT au."userId") AS user_count,
        COUNT(DISTINCT ch.id) AS chat_count,
        COALESCE(m.message_count, 0) AS message_count,
        COALESCE(tc.tool_call_count, 0) AS tool_call_count,
        -- JSON aggregate of tools/resources with origin favicon and id
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', r.id,
              'originFavicon', o.favicon
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS resources
      FROM "AgentConfiguration" ac
      LEFT JOIN "AgentUser" au ON au."agentConfigurationId" = ac.id
      LEFT JOIN "Chat" ch ON ch."userAgentConfigurationId" = au.id
      LEFT JOIN (
        SELECT acu."agentConfigurationId", COUNT(m."Message") AS message_count
        FROM "Chat" c
        LEFT JOIN "AgentUser" acu ON c."userAgentConfigurationId" = acu.id
        LEFT JOIN "Message" m ON c.id = m."chatId"
        WHERE c."userAgentConfigurationId" IS NOT NULL
        GROUP BY acu."agentConfigurationId"
      ) m ON m."agentConfigurationId" = ac.id
      LEFT JOIN (
        SELECT acu."agentConfigurationId", COUNT(tc.id) AS tool_call_count
        FROM "Chat" c
        LEFT JOIN "AgentUser" acu ON c."userAgentConfigurationId" = acu.id
        LEFT JOIN "ToolCall" tc ON c.id = tc."chatId"
        WHERE c."userAgentConfigurationId" IS NOT NULL
        GROUP BY acu."agentConfigurationId"
      ) tc ON tc."agentConfigurationId" = ac.id
      -- Join to tools/resources related to the AgentConfiguration
      LEFT JOIN "AgentConfigurationResource" acr ON acr."agentConfigurationId" = ac.id
      LEFT JOIN "Resources" r ON acr."resourceId" = r.id
      LEFT JOIN "ResourceOrigin" o ON r."originId" = o.id
      WHERE ac.visibility = 'public'
      GROUP BY 
        ac.id, ac.name, ac.description, ac.image, ac."systemPrompt", ac.visibility, ac."createdAt", m.message_count, tc.tool_call_count
      ORDER BY message_count DESC
    `,
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        image: z.string().nullable(),
        systemPrompt: z.string(),
        visibility: z.enum(['public', 'private']),
        createdAt: z.date(),
        user_count: z.bigint(),
        chat_count: z.bigint(),
        message_count: z.bigint(),
        tool_call_count: z.bigint(),
        resources: z.array(
          z.object({
            id: z.string(),
            originFavicon: z.string().nullable(),
          })
        ),
      })
    )
  );

  return agentConfigurations;
};

export const listAgentConfigurationsByUserId = async (userId: string) => {
  return await prisma.agentConfigurationUser.findMany({
    where: {
      userId,
    },
    include: {
      agentConfiguration: true,
    },
    orderBy: { chats: { _count: 'desc' } },
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
