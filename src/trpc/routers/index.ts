import { createCallerFactory, createTRPCRouter } from '../trpc';

import { availableToolsRouter } from './available-tools';
import { facilitatorsRouter } from './facilitators';
import { resourcesRouter } from './resources';
import { resourceTagsRouter } from './resource-tags';
import { resourceRequestMetadataRouter } from './resource-request-metadata';
import { sellersRouter } from './sellers';
import { statisticsRouter } from './statistics';
import { transactionsRouter } from './transactions';
import { transfersRouter } from './transfers';
import { toolsRouter } from './tools';
import { userRouter } from './user';
import { publicRouter } from './public';

export const appRouter = createTRPCRouter({
  user: userRouter,
  public: publicRouter,
  stats: statisticsRouter,
  sellers: sellersRouter,
  resources: resourcesRouter,
  resourceTags: resourceTagsRouter,
  resourceRequestMetadata: resourceRequestMetadataRouter,
  transactions: transactionsRouter,
  transfers: transfersRouter,
  facilitators: facilitatorsRouter,
  availableTools: availableToolsRouter,
  tools: toolsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
