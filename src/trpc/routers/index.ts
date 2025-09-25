import { createCallerFactory, createTRPCRouter } from "../trpc";

import { resourcesRouter } from "./resources";
import { sellersRouter } from "./sellers";
import { statisticsRouter } from "./statistics";

export const appRouter = createTRPCRouter({
  stats: statisticsRouter,
  sellers: sellersRouter,
  resources: resourcesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
