'use client';

import { Fragment } from 'react';

import { CopyIcon } from 'lucide-react';

import { isToolUIPart } from 'ai';

import { Action, Actions } from '@/components/ui/ai-elements/actions';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ui/ai-elements/conversation';
import { Loader } from '@/components/ui/ai-elements/loader';
import { Message, MessageContent } from '@/components/ui/ai-elements/message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ui/ai-elements/reasoning';
import { Response } from '@/components/ui/ai-elements/response';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from '@/components/ui/ai-elements/tool';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ui/ai-elements/sources';

import type { UIMessage } from '@ai-sdk/react';
import type { ChatStatus } from './chat';
import { Logo } from '@/components/logo';

interface MessagesProps {
  messages: UIMessage[];
  status: ChatStatus;
}

export const Messages = ({ messages, status }: MessagesProps) => {
  return (
    <Conversation className="h-full w-full max-w-4xl mx-auto">
      <ConversationContent className="py-0 h-full">
        {messages.length === 0 ? (
          <ConversationEmptyState
            icon={<Logo className="size-12" />}
            title="Welcome to x402scan Chat"
            description="Your playground invoking x402 resources through an agent"
          />
        ) : (
          messages.map(message => (
            <div key={message.id}>
              {message.role === 'assistant' &&
                message.parts.filter(part => part.type === 'source-url')
                  .length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(part => part.type === 'source-url')
                          .length
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
                          <Message from={message.role}>
                            <MessageContent>
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
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
                            message.id === messages.at(-1)?.id
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
            </div>
          ))
        )}
        {status === 'submitted' && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};
