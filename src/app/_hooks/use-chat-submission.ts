'use client';

import { useState } from 'react';
import type { UseAgentConfigurationReturn } from './use-agent-configuration';
import type { UIMessage, UseChatHelpers } from '@ai-sdk/react';

interface UseChatSubmissionProps {
  id: string;
  sendMessage: UseChatHelpers<UIMessage>['sendMessage'];
  agentConfig?: UseAgentConfigurationReturn;
}

export function useChatSubmission({
  id,
  sendMessage,
  agentConfig,
}: UseChatSubmissionProps) {
  const [input, setInput] = useState('');

  // Get model and tools directly from agentConfig
  const model = agentConfig?.currentAgent?.model ?? 'gpt-4o';
  const selectedTools = agentConfig?.currentAgent?.tools ?? [];

  // When model or tools change, update the agent configuration
  const handleSetModel = (newModel: string) => {
    if (agentConfig) {
      agentConfig.updateLocalAgent({ model: newModel });
    }
  };

  const handleSetSelectedTools = (newTools: string[]) => {
    if (agentConfig) {
      agentConfig.updateLocalAgent({ tools: newTools });
    }
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) {
      return;
    }
    window.history.replaceState({}, '', `/chat/${id}`);
    void sendMessage(
      { text },
      {
        body: {
          model,
          selectedTools,
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

  return {
    input,
    setInput,
    model,
    setModel: handleSetModel,
    selectedTools,
    setSelectedTools: handleSetSelectedTools,
    handleSubmit,
  };
}
