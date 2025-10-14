'use client';

import { useState } from 'react';
import type { Chat } from '@prisma/client';

interface UseChatSubmissionProps {
  isAuthed: boolean;
  currentChat: Chat | undefined;
  sendMessage: (
    message: { text: string },
    options?: {
      body?: {
        model: string;
        selectedTools: string[];
        chatId: string;
      };
    }
  ) => void;
}

export function useChatSubmission({ 
  isAuthed, 
  currentChat,
  sendMessage,
}: UseChatSubmissionProps) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>('gpt-4o');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const sendChatMessage = (text: string) => {
    if (!isAuthed) {
      return;
    }
    
    if (!text.trim()) {
      return;
    }
    if (!currentChat?.id) {
      throw new Error('Current chat not found');
    }
    sendMessage(
      { text },
      {
        body: {
          model: model,
          selectedTools: selectedTools,
          chatId: currentChat.id,
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendChatMessage(suggestion);
  };

  return {
    input,
    setInput,
    model,
    setModel,
    selectedTools,
    setSelectedTools,
    handleSubmit,
    handleSuggestionClick,
  };
}
