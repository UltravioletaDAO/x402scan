import { createContext } from 'react';

import type { ParsedX402Response } from '@/lib/x402/schema';
import { Methods } from '@/types/methods';

interface ResourceExecutorContextType {
  resource: string;
  method: Methods | undefined;
  response: ParsedX402Response | null;
  isLoading: boolean;
  error: string | null;
  parseErrors: string[];
  refetch: () => void;
  rawResponse: unknown;
}

export const ResourceExecutorContext =
  createContext<ResourceExecutorContextType>({
    resource: '',
    method: Methods.GET,
    response: null,
    isLoading: false,
    error: null,
    parseErrors: [],
    refetch: () => {
      // noop
    },
    rawResponse: null,
  });
