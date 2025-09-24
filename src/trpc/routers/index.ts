import { createCallerFactory, createTRPCRouter } from "../trpc";
import { resourcesRouter } from "./resources";

import { sellersRouter } from "./sellers";

export const appRouter = createTRPCRouter({
  sellers: sellersRouter,
  resources: resourcesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
