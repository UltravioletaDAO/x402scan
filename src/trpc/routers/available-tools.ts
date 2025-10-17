import { publicProcedure, createTRPCRouter } from '../trpc';
import {
  generateX402Tools,
  generateX402ToolsOptionsSchema,
} from '@/services/agent/get-tools';

export const availableToolsRouter = createTRPCRouter({
  list: publicProcedure
    .input(generateX402ToolsOptionsSchema)
    .query(async ({ input }) => {
      const tools = await generateX402Tools(input);

      return tools.map(tool => {
        return {
          id: tool.id,
          description: tool.description,
          resource: tool.resource,
          network: tool.network,
          maxAmountRequired: tool.maxAmountRequired,
          origin: tool.origin,
          invocations: tool.invocations,
        };
      });
    }),
});
