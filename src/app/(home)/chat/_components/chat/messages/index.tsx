'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';

import { EmptyState } from './empty-state';
import { Message } from './message';

import type { ChatStatus } from 'ai';
import type { UIMessage } from '@ai-sdk/react';

interface MessagesProps {
  messages: UIMessage[];
  status: ChatStatus;
}

export const Messages = ({ messages, status }: MessagesProps) => {
  return (
    <Conversation className="h-full w-full">
      {messages.length > 0 ? (
        <>
          <ConversationContent className="max-w-4xl mx-auto">
            {messages.map(message => (
              <Message
                key={message.id}
                message={message}
                status={status}
                isLast={message.id === messages.at(-1)?.id}
              />
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </>
      ) : (
        <EmptyState />
      )}
    </Conversation>
  );
};

export const EmptyMessages = () => {
  return (
    <Conversation className="h-full w-full">
      <EmptyState />
    </Conversation>
  );
};
