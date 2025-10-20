'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Bot } from 'lucide-react';

import { useChat } from '@ai-sdk/react';

import { toast } from 'sonner';

import { Card } from '@/components/ui/card';

import { EmptyMessages, LoadingMessages, Messages } from './messages';
import { LoadingPromptInputSection, PromptInputSection } from './input';

import { api } from '@/trpc/client';

import { convertToUIMessages } from '@/lib/utils';

import { useSession } from 'next-auth/react';
import { clientCookieUtils } from '../../chat/_lib/cookies/client';

import type { Message } from '@prisma/client';
import type { ChatConfig, SelectedResource } from '../../_types/chat-config';
import type { RouterOutputs } from '@/trpc/client';

interface Props {
  id: string;
  initialMessages: Message[];
  isReadOnly?: boolean;
  initialConfig?: ChatConfig;
  storeConfig?: boolean;
  agentConfig?: RouterOutputs['public']['agents']['get'];
}

export const ChatContent: React.FC<Props> = ({
  id,
  isReadOnly,
  initialMessages,
  initialConfig,
  storeConfig,
  agentConfig,
}) => {
  const utils = api.useUtils();

  const { data: session } = useSession();

  const { data: usdcBalance } = api.user.serverWallet.usdcBaseBalance.useQuery(
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
      window.history.replaceState(
        {},
        '',
        agentConfig
          ? `/composer/agent/${agentConfig.id}/chat/${id}`
          : `/composer/chat/${id}`
      );
      void utils.user.chats.list.invalidate();
      setTimeout(() => {
        void utils.user.serverWallet.usdcBaseBalance.invalidate();
      }, 3000);
    },
  });

  const [input, setInput] = useState('');
  const [model, setModel] = useState(initialConfig?.model ?? 'gpt-4o');
  const [selectedResources, setSelectedResources] = useState<
    SelectedResource[]
  >(initialConfig?.resources ?? []);

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
          resourceIds: selectedResources.map(resource => resource.id),
          chatId: id,
          agentConfigurationId: agentConfig?.id,
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
    if (storeConfig) {
      clientCookieUtils.setSelectedChatModel(model);
    }
  };

  const onSelectResource = (resource: SelectedResource) => {
    const newResources = [...selectedResources];
    const existingIndex = newResources.findIndex(r => r.id === resource.id);
    if (existingIndex !== -1) {
      newResources.splice(existingIndex, 1);
    } else {
      newResources.push(resource);
    }
    setSelectedResources(newResources);
    if (storeConfig) {
      clientCookieUtils.setResources(newResources);
    }
  };

  return (
    <div className="flex flex-col relative flex-1 h-0 overflow-hidden">
      <Messages
        messages={messages}
        status={status}
        model={model}
        emptyState={
          agentConfig
            ? {
                title: agentConfig.name,
                description: agentConfig.description ?? 'No description',
                icon: agentConfig.image ? (
                  <Image
                    src={agentConfig.image}
                    alt={agentConfig.name}
                    width={96}
                    height={96}
                    className="size-16 rounded-md overflow-hidden"
                  />
                ) : (
                  <Card className="p-2 border">
                    <Bot className="size-12" />
                  </Card>
                ),
              }
            : undefined
        }
      />
      {!isReadOnly && (
        <div className="pb-2 md:pb-4">
          <div className="mx-auto max-w-4xl px-2">
            <PromptInputSection
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              model={model}
              setModel={handleSetModel}
              selectedResources={selectedResources}
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
