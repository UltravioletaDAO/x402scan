import { prisma } from '../client';

export const listUserAgentConfigurations = async (userId: string) => {
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
