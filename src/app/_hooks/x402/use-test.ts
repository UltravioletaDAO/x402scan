'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { parseX402Response } from '@/lib/x402/schema';
import {
  createFetchWithProxyHeader,
  PROXY_ENDPOINT,
} from '@/lib/x402/proxy-fetch';

export const useX402Test = (
  resource: string,
  init?: RequestInit,
  options?: { enabled?: boolean }
) => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['x402-test', resource, init],
    queryFn: async () => {
      const fetchWithProxyHeader = createFetchWithProxyHeader(resource);
      const proxyResponse = await fetchWithProxyHeader(PROXY_ENDPOINT, init);

      if (proxyResponse.status === 402 || proxyResponse.ok) {
        const data = (await proxyResponse.json().catch(() => null)) as unknown;
        return data;
      } else {
        const text = await proxyResponse.text();
        throw new Error(text || `Request failed with ${proxyResponse.status}`);
      }
    },
    enabled: options?.enabled ?? true,
    retry: false,
  });

  const { data: x402Response, errors: parseErrors } = useMemo(() => {
    if (!data) return { data: null, errors: [] };
    return parseX402Response(data);
  }, [data]);

  return {
    isLoading: isPending,
    response: data,
    rawResponse: data,
    error: error?.message ?? null,
    x402Response,
    parseErrors,
    refetch,
  };
};
