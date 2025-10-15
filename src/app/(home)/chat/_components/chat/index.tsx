'use client';

import { useChat } from '@ai-sdk/react';

import { Messages } from './messages';
import { PromptInputSection } from './input';

import { useChatSubmission } from '@/app/_hooks/use-chat-submission';
import { useAgentConfiguration } from '@/app/_hooks/use-agent-configuration';

import { convertToUIMessages } from '@/lib/utils';
import type { Message } from '@prisma/client';

interface Props {
  id: string;
  initialMessages: Message[];
  isReadOnly?: boolean;
}

export const Chat: React.FC<Props> = ({ id, initialMessages }) => {
  const agentConfig = useAgentConfiguration();

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages ? convertToUIMessages(initialMessages) : [],
  });

  const {
    input,
    setInput,
    model,
    setModel,
    selectedTools,
    setSelectedTools,
    handleSubmit,
  } = useChatSubmission({
    id,
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
