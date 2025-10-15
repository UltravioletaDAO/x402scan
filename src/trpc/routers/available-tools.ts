import { publicProcedure, createTRPCRouter } from '../trpc';
import { generateX402Tools } from '@/services/agent/get-tools';

export const availableToolsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const tools = await generateX402Tools();

    return tools.map(tool => {
      return {
        id: tool.id,
        description: tool.description,
        resource: tool.resource,
        network: tool.network,
        maxAmountRequired: tool.maxAmountRequired,
        origin: tool.origin,
      };
    });
  }),
});
