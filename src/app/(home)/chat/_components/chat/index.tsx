'use client';

import { useChat } from '@ai-sdk/react';

import { Messages } from './messages';
import { PromptInputSection } from './input';

import { useChatSubmission } from '@/app/_hooks/use-chat-submission';
import { useAgentConfiguration } from '@/app/_hooks/use-agent-configuration';

import type { RouterOutputs } from '@/trpc/client';
import { convertToUIMessages } from '@/lib/utils';

interface Props {
  chat: RouterOutputs['chats']['getOrCreateChat'];
}

export const Chat: React.FC<Props> = ({ chat }) => {
  // Agent configuration hook
  const agentConfig = useAgentConfiguration();

  // AI SDK useChat hook - initialized with latest messages from backend
  const { messages, sendMessage, status } = useChat({
    messages: chat.messages ? convertToUIMessages(chat.messages) : [],
  });

  // Chat submission logic
  const {
    input,
    setInput,
    model,
    setModel,
    selectedTools,
    setSelectedTools,
    handleSubmit,
  } = useChatSubmission({
    chatId: chat.id,
    sendMessage,
    agentConfig,
  });

  return (
    <div className="flex h-full flex-col relative">
      <Messages messages={messages} status={status} />

      <div className="pb-2 md:pb-4">
        <div className="mx-auto max-w-4xl">
          <PromptInputSection
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            model={model}
            setModel={setModel}
            selectedTools={selectedTools}
            setSelectedTools={setSelectedTools}
            status={status}
          />
        </div>
      </div>
    </div>
  );
};
