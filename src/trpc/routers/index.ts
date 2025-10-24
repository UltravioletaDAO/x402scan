import { createCallerFactory, createTRPCRouter } from '../trpc';

import { userRouter } from './user';
import { publicRouter } from './public';
import { adminRouter } from './admin';

export const appRouter = createTRPCRouter({
  user: userRouter,
  public: publicRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
