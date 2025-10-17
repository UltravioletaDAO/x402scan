'use client';

import { useState } from 'react';

import { useChat } from '@ai-sdk/react';

import { toast } from 'sonner';

import { EmptyMessages, LoadingMessages, Messages } from './messages';
import { LoadingPromptInputSection, PromptInputSection } from './input';

import { api } from '@/trpc/client';

import { convertToUIMessages } from '@/lib/utils';

import type { Message } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { clientCookieUtils } from '../../_lib/cookies/client';

import type { ChatPreferences } from '../../_lib/cookies/types';

interface Props {
  id: string;
  initialMessages: Message[];
  isReadOnly?: boolean;
  initialPreferences?: ChatPreferences;
  storePreferences?: boolean;
}

export const ChatContent: React.FC<Props> = ({
  id,
  isReadOnly,
  initialMessages,
  initialPreferences,
  storePreferences,
}) => {
  const utils = api.useUtils();

  const { data: session } = useSession();

  const { data: usdcBalance } = api.serverWallet.usdcBaseBalance.useQuery(
    undefined,
    {
      enabled: !!session,
    }
  );
  const hasBalance = usdcBalance && usdcBalance > 0;

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages ? convertToUIMessages(initialMessages) : [],
    onError: error => {
      toast.error(error.message);
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
      void utils.chats.getUserChats.invalidate();
      setTimeout(() => {
        void utils.serverWallet.usdcBaseBalance.invalidate();
      }, 3000);
    },
  });

  const [input, setInput] = useState('');
  const [model, setModel] = useState(
    initialPreferences?.selectedChatModel ?? 'gpt-4o'
  );
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>(
    initialPreferences?.resourceIds ?? []
  );

  const sendChatMessage = (text: string) => {
    if (!hasBalance) {
      toast.error('Please fund your wallet to continue');
      return;
    }
    if (!text.trim()) {
      toast.error('Please enter a message');
      return;
    }
    void sendMessage(
      { text },
      {
        body: {
          model,
          resourceIds: selectedResourceIds,
          chatId: id,
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(input);
    setInput('');
  };

  const handleSetModel = (model: string) => {
    setModel(model);
    if (storePreferences) {
      clientCookieUtils.setSelectedChatModel(model);
    }
  };

  const onSelectResource = (resourceId: string) => {
    const newResourceIds = [...selectedResourceIds];
    const existingIndex = newResourceIds.indexOf(resourceId);
    if (existingIndex !== -1) {
      newResourceIds.splice(existingIndex, 1);
    } else {
      newResourceIds.push(resourceId);
    }
    setSelectedResourceIds(newResourceIds);
    if (storePreferences) {
      clientCookieUtils.setResourceIds(newResourceIds);
    }
  };

  return (
    <div className="flex flex-col relative flex-1 h-0 overflow-hidden">
      <Messages messages={messages} status={status} />
      {!isReadOnly && (
        <div className="pb-2 md:pb-4">
          <div className="mx-auto max-w-4xl px-2">
            <PromptInputSection
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              model={model}
              setModel={handleSetModel}
              selectedResourceIds={selectedResourceIds}
              onSelectResource={onSelectResource}
              status={status}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const LoadingEmptyChat = () => {
  return (
    <div className="flex flex-col relative flex-1 h-0 overflow-hidden">
      <EmptyMessages />
      <div className="pb-2 md:pb-4">
        <div className="mx-auto max-w-4xl px-2">
          <LoadingPromptInputSection />
        </div>
      </div>
    </div>
  );
};

export const LoadingMessagesChat = () => {
  return (
    <div className="flex flex-col relative flex-1 h-0 overflow-hidden">
      <LoadingMessages />
      <div className="pb-2 md:pb-4">
        <div className="mx-auto max-w-4xl px-2">
          <LoadingPromptInputSection />
        </div>
      </div>
    </div>
  );
};
