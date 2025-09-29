import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { parseX402Response, type ParsedX402Response } from "./x402-schema";
import { useWalletClient } from "wagmi";
import { wrapFetchWithPayment } from "x402-fetch";

const PROXY_ENDPOINT = "/api/test-402" as const;
const TARGET_HEADER = "x-proxy-target" as const;


function createFetchWithProxyHeader(targetUrl: string) {
  return async (input: RequestInfo | URL, requestInit?: RequestInit) => {
    const headers = new Headers(requestInit?.headers);
    headers.set(TARGET_HEADER, targetUrl);

    const { method = "GET", ...restInit } = requestInit ?? {};
    const normalizedMethod = method.toString().toUpperCase();

    // Auto-add Content-Type for requests with body
    if (normalizedMethod !== "GET" && normalizedMethod !== "HEAD" && restInit.body) {
      headers.set("Content-Type", "application/json");
    }

    // Clear body for GET/HEAD requests
    const finalInit: RequestInit = {
      ...restInit,
      method: normalizedMethod,
      headers,
    };

    if (normalizedMethod === "GET" || normalizedMethod === "HEAD") {
      finalInit.body = undefined;
    }

    return fetch(input, finalInit);
  };
}

export const useX402Fetch = <TData = unknown>(
  targetUrl: string,
  value: bigint,
  init?: RequestInit,
  options?: Omit<UseMutationOptions<TData>, "mutationFn">,
) => {
  const { data: walletClient } = useWalletClient({
    chainId: 8453,
  });

  return useMutation({
    mutationFn: async () => {
      if (!walletClient) throw new Error("Wallet client not available");

      const fetchWithProxyHeader = createFetchWithProxyHeader(targetUrl);
      const fetchWithPayment = wrapFetchWithPayment(
        fetchWithProxyHeader,
        walletClient as unknown as Parameters<typeof wrapFetchWithPayment>[1],
        value,
      );

      const response = await fetchWithPayment(PROXY_ENDPOINT, init);
      const contentType = response.headers.get("content-type") ?? "";

      return contentType.includes("application/json")
        ? response.json() as Promise<TData>
        : response.text() as Promise<TData>;
    },
    ...options,
  });
};

export const useX402Test = (
  resource: string,
  init?: RequestInit,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    queryKey: ["x402-test", resource, init],
    queryFn: async () => {
      const fetchWithProxyHeader = createFetchWithProxyHeader(resource);
      const proxyResponse = await fetchWithProxyHeader(PROXY_ENDPOINT, init);

      if (proxyResponse.status === 402) {
        const data = await proxyResponse.json().catch(() => null);
        return data;
      } else if (!proxyResponse.ok) {
        const text = await proxyResponse.text();
        throw new Error(text || `Request failed with ${proxyResponse.status}`);
      } else {
        const data = await proxyResponse.json().catch(() => null);
        return data;
      }
    },
    enabled: options?.enabled ?? true,
    retry: false,
  });

  const x402Response = useMemo(() => {
    if (!query.data) return null;
    const parseResult = parseX402Response(query.data);
    return parseResult.success ? parseResult.data : null;
  }, [query.data]);

  const parseErrors = useMemo(() => {
    if (!query.data) return [];
    const parseResult = parseX402Response(query.data);
    return parseResult.errors;
  }, [query.data]);

  return {
    isLoading: query.isPending,
    response: query.data,
    rawResponse: query.data,
    error: query.error?.message || null,
    x402Response,
    parseErrors,
    refetch: query.refetch,
  };
};