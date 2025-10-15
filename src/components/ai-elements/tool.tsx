'use client';

import type { ToolUIPart } from 'ai';
import { ChevronDownIcon, WrenchIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { JsonViewer } from './json-viewer';
import { Code } from '../ui/code';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

const Tool = ({ className, ...props }: ComponentProps<typeof Collapsible>) => (
  <Collapsible
    className={cn('not-prose w-full rounded-md border', className)}
    {...props}
  />
);

const ToolHeader = ({
  className,
  type,
  ...props
}: {
  type: ToolUIPart['type'];
  state: ToolUIPart['state'];
  className?: string;
}) => (
  <CollapsibleTrigger
    className={cn(
      'flex w-full items-center justify-between gap-4 p-3',
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      <WrenchIcon className="size-4 text-muted-foreground" />
      <span className="font-medium text-sm">{type}</span>
    </div>
    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

const ToolContent = ({
  className,
  ...props
}: ComponentProps<typeof CollapsibleContent>) => (
  <CollapsibleContent
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in space-y-2 py-4',
      className
    )}
    {...props}
  />
);

const ToolInput = ({
  className,
  input,
  ...props
}: ComponentProps<'div'> & {
  input: ToolUIPart['input'];
}) => (
  <div className={cn('space-y-2 overflow-hidden px-4', className)} {...props}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase font-mono">
      Parameters
    </h4>
    <div className="rounded-md bg-muted">
      <JsonViewer data={input as JsonValue} />
    </div>
  </div>
);

const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ComponentProps<'div'> & {
  output: ReactNode;
  errorText: ToolUIPart['errorText'];
}) => {
  if (!(output || errorText)) {
    return null;
  }

  const parseOutput = (output: ReactNode) => {
    if (typeof output !== 'string') {
      return { raw: output, parsed: null };
    }

    const trimmed = output.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return { raw: output, parsed: JSON.parse(trimmed) as JsonValue };
      } catch {
        return { raw: output, parsed: null };
      }
    }

    return { raw: output, parsed: null };
  };

  const result = output ? parseOutput(output) : { raw: null, parsed: null };
  const { raw, parsed } = result;

  return (
    <div className={cn('space-y-2 px-4', className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase font-mono">
        {errorText ? 'Error' : 'Result'}
      </h4>
      <div
        className={cn(
          'overflow-x-auto rounded-md text-xs [&_table]:w-full font-mono',
          errorText
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-foreground'
        )}
      >
        {errorText && <div className="p-3">{errorText}</div>}
        {parsed && <JsonViewer data={parsed} defaultCollapsed={true} />}
        {!parsed && raw && (
          <Code value={JSON.stringify(raw, null, 2)} lang="json" />
        )}
      </div>
    </div>
  );
};

export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput };
