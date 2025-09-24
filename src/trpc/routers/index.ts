import { createCallerFactory, createTRPCRouter } from "../trpc";

import { sellersRouter } from "./sellers";

export const appRouter = createTRPCRouter({
  sellers: sellersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
