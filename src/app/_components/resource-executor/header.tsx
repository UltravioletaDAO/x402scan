'use client';

import { useMemo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Method } from './method';
import { useResourceExecutor } from './context/hook';

import type { Resources } from '@prisma/client';
import { FetchButton } from './fetch-button';

interface Props {
  resource: Resources;
}

export const Header: React.FC<Props> = ({ resource }) => {
  const {
    isLoading,
    response,
    rawResponse,
    error,
    response: x402Response,
    parseErrors,
    method,
  } = useResourceExecutor();

  const [showDialog, setShowDialog] = useState(false);

  // const price = useMemo(() => {
  //   const maxAmount = response?.accepts?.[0]?.maxAmountRequired;
  //   if (!maxAmount) return '0.00';
  //   const value = Number(maxAmount) / 1_000_000;
  //   return value.toFixed(2);
  // }, [response]);

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
  const errorContent = error ?? parseErrors.join('\n');
  const hasResponse = !isLoading && Boolean(rawResponse ?? hasError);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Method method={method} />
          <span className="font-mono text-sm truncate">
            {resource.resource}
          </span>
          <div
            className={`w-3 h-3 rounded-full ${statusColor} ${hasResponse ? 'cursor-pointer' : ''}`}
            onClick={hasResponse ? () => setShowDialog(true) : undefined}
          />
        </div>
        {Boolean(rawResponse) && !hasError && <FetchButton />}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
    </>
  );
};
