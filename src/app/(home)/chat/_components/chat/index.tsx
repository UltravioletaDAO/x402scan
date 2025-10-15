'use client';

import { useState } from 'react';

import { useChat } from '@ai-sdk/react';

import { toast } from 'sonner';

import { Messages } from './messages';
import { PromptInputSection } from './input';

import { api } from '@/trpc/client';

import { convertToUIMessages } from '@/lib/utils';

import type { Message } from '@prisma/client';

interface Props {
  id: string;
  initialMessages: Message[];
  isReadOnly?: boolean;
}

export const Chat: React.FC<Props> = ({ id, initialMessages }) => {
  const utils = api.useUtils();

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages ? convertToUIMessages(initialMessages) : [],
    onError: error => {
      toast.error(error.message);
    },
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
      void utils.chats.getUserChats.invalidate();
      void utils.serverWallet.usdcBaseBalance.invalidate();
    },
  });

  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);

  const sendChatMessage = (text: string) => {
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

  return (
    <div className="flex flex-col relative flex-1 h-0 overflow-hidden">
      <Messages messages={messages} status={status} />
      <div className="pb-2 md:pb-4">
        <div className="mx-auto max-w-4xl px-2">
          <PromptInputSection
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            model={model}
            setModel={setModel}
            selectedResourceIds={selectedResourceIds}
            onSelectResource={resourceId =>
              setSelectedResourceIds(prev =>
                prev.includes(resourceId)
                  ? prev.filter(id => id !== resourceId)
                  : [...prev, resourceId]
              )
            }
            status={status}
          />
        </div>
      </div>
    </div>
  );
};
