import { useMemo } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useResourceCheck } from '../contexts/resource-check/hook';

import type { ParsedX402Response } from '@/lib/x402/schema';

import { cn } from '@/lib/utils';

export const Status = () => {
  const { isLoading, error, rawResponse, parseErrors } = useResourceCheck();

  const hasError = Boolean(error) || parseErrors.length > 0;
  const hasResponse = !isLoading && Boolean(rawResponse ?? hasError);

  if (!hasResponse) return null;

  const errorContent = error ?? parseErrors?.join('\n');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Dot />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasError ? 'Error Details' : 'Response Details'}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-60 overflow-auto space-y-4">
          {hasError && (
            <div>
              <h4 className="text-sm font-medium mb-2">Error</h4>
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {errorContent}
              </pre>
            </div>
          )}
          {rawResponse != null && rawResponse !== undefined && (
            <div>
              <h4 className="text-sm font-medium mb-2">Raw Response</h4>
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DotProps {
  onClick?: () => void;
  hasResponse?: boolean;
  isLoading?: boolean;
  error?: string | null;
  response?: unknown;
  x402Response?: ParsedX402Response | null;
  parseErrors?: string[];
}

const Dot: React.FC<DotProps> = ({ onClick }) => {
  const {
    isLoading,
    error,
    response,
    response: x402Response,
    parseErrors,
    rawResponse,
  } = useResourceCheck();

  const statusColor = useMemo(() => {
    if (isLoading) return 'bg-gray-500';
    if (error || !response) return 'bg-red-500';
    if (response && x402Response && parseErrors.length === 0)
      return 'bg-green-600';
    if (response && (!x402Response || parseErrors.length > 0))
      return 'bg-red-600';
    return 'bg-gray-600';
  }, [isLoading, error, response, x402Response, parseErrors]);

  const hasError = Boolean(error) || parseErrors.length > 0;
  const hasResponse = !isLoading && Boolean(rawResponse ?? hasError);

  return (
    <div
      className={cn(
        'w-3 h-3 rounded-full shrink-0',
        statusColor,
        hasResponse && 'cursor-pointer'
      )}
      onClick={onClick}
    />
  );
};
