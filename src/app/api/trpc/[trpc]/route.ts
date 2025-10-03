import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '@/trpc/routers';
import { createTRPCContext } from '@/trpc/trpc';
import { env } from '@/env';

const createContext = async (req: NextRequest) => {
  return createTRPCContext(req.headers);
};

/**
 * TRPC request handler for all HTTP methods
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ path, error }) => {
      // Also log to console in development for immediate feedback
      if (env.NEXT_PUBLIC_NODE_ENV === 'development') {
        console.error(
          `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
        );
      }
    },
    responseMeta(opts) {
      const { errors, type } = opts;
      const allOk = errors.length === 0;
      const isQuery = type === 'query';

      // Cache all successful query requests for 60 seconds
      // Using both max-age (for browser/local) and s-maxage (for CDN)
      if (allOk && isQuery) {
        return {
          headers: {
            'cache-control':
              'public, max-age=60, s-maxage=60, stale-while-revalidate=60',
          },
        };
      }
      return {};
    },
  });

export { handler as GET, handler as POST };
