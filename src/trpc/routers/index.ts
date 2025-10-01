import { createCallerFactory, createTRPCRouter } from '../trpc';

import { acceptsRouter } from './accepts';
import { originsRouter } from './origins';
import { resourcesRouter } from './resources';
import { sellersRouter } from './sellers';
import { statisticsRouter } from './statistics';
import { transactionsRouter } from './transactions';
import { transfersRouter } from './transfers';

export const appRouter = createTRPCRouter({
  accepts: acceptsRouter,
  stats: statisticsRouter,
  sellers: sellersRouter,
  resources: resourcesRouter,
  origins: originsRouter,
  transactions: transactionsRouter,
  transfers: transfersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
