'use client';

import { useState } from 'react';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import {
  httpBatchStreamLink,
  httpLink,
  isNonJsonSerializable,
  loggerLink,
  splitLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterOutputs } from '@trpc/server';

import SuperJSON from 'superjson';

import { createQueryClient } from './query-client';
import { env } from '@/env';

import type { AppRouter } from './routers';
import type { QueryClient } from '@tanstack/react-query';

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: op =>
            env.NEXT_PUBLIC_NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        splitLink({
          condition: op => isNonJsonSerializable(op.input),
          true: httpLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers: () => {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            },
          }),
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers: () => {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            },
          }),
        }),
      ],
    })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </PersistQueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  return env.NEXT_PUBLIC_APP_URL;
}

export type RouterOutputs = inferRouterOutputs<AppRouter>;
