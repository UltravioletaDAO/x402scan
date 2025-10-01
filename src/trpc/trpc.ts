import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type z from 'zod';
import { ZodError } from 'zod';
import { infiniteQuerySchema } from '@/lib/pagination';

/**
 * Context that is passed to all TRPC procedures
 */
interface Context {
  headers: Headers;
}

/**
 * Create context for each request
 */
export async function createTRPCContext(headers: Headers): Promise<Context> {
  return {
    headers,
  };
}

/**
 * Initialize TRPC with our context and transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// ----------------------------
// Export reusable router and procedure helpers
// ----------------------------

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

// ----------------------------
// Middleware
// ----------------------------

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

// ----------------------------
// Procedures
// ----------------------------

export const publicProcedure = t.procedure.use(timingMiddleware);

export const infiniteQueryProcedure = <T>(cursorType: z.ZodType<T>) =>
  t.procedure
    .input(infiniteQuerySchema(cursorType))
    .use(async ({ ctx, next, input }) => {
      return next({
        ctx: {
          ...ctx,
          pagination: input,
        },
      });
    });
