import { createCallerFactory, createTRPCRouter } from "../trpc";
import { acceptsRouter } from "./accepts";
import { originsRouter } from "./origins";

import { resourcesRouter } from "./resources";
import { sellersRouter } from "./sellers";
import { statisticsRouter } from "./statistics";

export const appRouter = createTRPCRouter({
  stats: statisticsRouter,
  sellers: sellersRouter,
  resources: resourcesRouter,
  origins: originsRouter,
  accepts: acceptsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
