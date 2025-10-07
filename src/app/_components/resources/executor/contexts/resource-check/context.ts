import { createContext } from 'react';

import type { ParsedX402Response } from '@/lib/x402/schema';
import { Methods } from '@/types/x402';

interface ResourceCheckContextType {
  resource: string;
  method: Methods | undefined;
  response: ParsedX402Response | null;
  isLoading: boolean;
  error: string | null;
  parseErrors: string[];
  refetch: () => void;
  rawResponse: unknown;
}

export const ResourceCheckContext = createContext<ResourceCheckContextType>({
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
