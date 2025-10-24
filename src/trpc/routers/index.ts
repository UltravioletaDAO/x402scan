import { createCallerFactory, createTRPCRouter } from '../trpc';

import { acceptsRouter } from './accepts';
import { facilitatorsRouter } from './facilitators';
import { networksRouter } from './networks';
import { onrampSessionsRouter } from './onramp-sessions';
import { originsRouter } from './origins';
import { resourcesRouter } from './resources';
import { sellersRouter } from './sellers';
import { statisticsRouter } from './statistics';
import { transfersRouter } from './transfers';
import { userRouter } from './user';
import { publicRouter } from './public';
import { adminRouter } from './admin';

export const appRouter = createTRPCRouter({
  accepts: acceptsRouter,
  stats: statisticsRouter,
  sellers: sellersRouter,
  resources: resourcesRouter,
  origins: originsRouter,
  transfers: transfersRouter,
  facilitators: facilitatorsRouter,
  networks: networksRouter,
  onrampSessions: onrampSessionsRouter,
  user: userRouter,
  public: publicRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
