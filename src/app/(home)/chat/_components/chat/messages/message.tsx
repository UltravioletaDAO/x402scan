'use client';

import { Fragment } from 'react';

import { CopyIcon } from 'lucide-react';

import { isToolUIPart } from 'ai';

import { toast } from 'sonner';

import { Action, Actions } from '@/components/ai-elements/actions';
import {
  Message as BaseMessage,
  MessageContent,
} from '@/components/ai-elements/message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Response } from '@/components/ai-elements/response';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from '@/components/ai-elements/tool';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';

import type { UIMessage, ChatStatus } from 'ai';

interface Props {
  message: UIMessage;
  status: ChatStatus;
  isLast: boolean;
}

export const Message: React.FC<Props> = ({ message, status, isLast }) => {
  return (
    <BaseMessage from={message.role}>
      {message.role === 'assistant' &&
        message.parts.filter(part => part.type === 'source-url').length > 0 && (
          <Sources>
            <SourcesTrigger
              count={
                message.parts.filter(part => part.type === 'source-url').length
              }
            />
            {message.parts
              .filter(part => part.type === 'source-url')
              .map((part, i) => (
                <SourcesContent key={`${message.id}-${i}`}>
                  <Source
                    key={`${message.id}-${i}`}
                    href={part.url}
                    title={part.url}
                  />
                </SourcesContent>
              ))}
          </Sources>
        )}
      {message.parts.map((part, i) => {
        if (isToolUIPart(part)) {
          return (
            <Tool key={`${message.id}-${i}`} defaultOpen={false}>
              <ToolHeader type={part.type} state={part.state} />
              <ToolContent>
                <ToolInput input={part.input} />
                <ToolOutput
                  output={JSON.stringify(part.output)}
                  errorText={part.errorText}
                />
              </ToolContent>
            </Tool>
          );
        } else {
          switch (part.type) {
            case 'text':
              return (
                <Fragment key={`${message.id}-${i}`}>
                  <MessageContent>
                    <Response key={`${message.id}-${i}`}>{part.text}</Response>
                  </MessageContent>
                  {message.role === 'assistant' &&
                    i === message.parts.length - 1 && (
                      <Actions className="-mt-2">
                        <Action
                          onClick={() =>
                            navigator.clipboard
                              .writeText(part.text)
                              .then(() => {
                                toast.success('Copied to clipboard');
                              })
                              .catch(() => {
                                toast.error('Failed to copy to clipboard');
                              })
                          }
                          label="Copy"
                        >
                          <CopyIcon className="size-3" />
                        </Action>
                      </Actions>
                    )}
                </Fragment>
              );
            case 'reasoning':
              return (
                <Reasoning
                  key={`${message.id}-${i}`}
                  className="w-full"
                  isStreaming={
                    status === 'streaming' &&
                    i === message.parts.length - 1 &&
                    isLast
                  }
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{part.text}</ReasoningContent>
                </Reasoning>
              );
            default:
              return null;
          }
        }
      })}
    </BaseMessage>
  );
};
