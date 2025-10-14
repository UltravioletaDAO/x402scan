'use client';

import { VerifyWalletModal } from '@/app/_components/chat/verify-wallet-modal';
import { FundWalletModal } from '@/app/_components/chat/fund-wallet-modal';
import { ChatSelector } from '@/app/_components/chat/chat-selector';
import { Messages } from '@/app/_components/chat/messages';
import { PromptInputSection } from '@/app/_components/chat/prompt-input-section';
import { useChat } from '@ai-sdk/react';
import { useChatSubmission } from '@/app/_hooks/use-chat-submission';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ServerChatData } from '@/lib/server-data';
import type { Chat } from '@prisma/client';
import type { UIMessage } from 'ai';

export type ChatStatus = 'streaming' | 'submitted' | 'awaiting-message' | 'ready' | 'error';

interface ChatProps {
  serverData: ServerChatData;
  chatId?: string;
}

interface ChatContentProps {
  currentChatId: string | undefined;
  createNewChat: () => void;
  currentChat: Chat | undefined;
  chatMessages: UIMessage[];
  isAuthed: boolean;
  showVerify: boolean;
  setShowVerify: (show: boolean) => void;
  usdcBalance: number | undefined;
  showFund: boolean;
  setShowFund: (show: boolean) => void;
}

const ChatContent = ({
  currentChatId,
  createNewChat,
  currentChat,
  chatMessages,
  isAuthed,
  showVerify,
  setShowVerify,
  usdcBalance,
  showFund,
  setShowFund,
}: ChatContentProps) => {

    // AI SDK useChat hook - initialized with latest messages from backend
    const { messages, sendMessage, status } = useChat({ 
      messages: chatMessages 
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
      handleSuggestionClick,
    } = useChatSubmission({
      isAuthed,
      currentChat,
      sendMessage: (message, options) => {
        void sendMessage(message, options);
      },
    });
  
  return (
    <div className="flex h-full flex-col">
      {/* Fixed top navigation */}
      {isAuthed && (
        <div className="flex-shrink-0 bg-background border-b">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <ChatSelector 
              currentChatId={currentChatId ?? undefined} 
              onNewChat={createNewChat}
            />
          </div>
        </div>
      )}
      
      {/* Scrollable messages area - takes remaining space */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-4xl px-6">
          <Messages messages={messages} status={status} />
        </div>
      </div>
      
      {/* Fixed bottom prompt area */}
      <div className="flex-shrink-0 bg-background border-t">
        <div className="mx-auto max-w-4xl p-6">
          <PromptInputSection
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            handleSuggestionClick={handleSuggestionClick}
            isAuthed={isAuthed}
            model={model}
            setModel={setModel}
            selectedTools={selectedTools}
            setSelectedTools={setSelectedTools}
            usdcBalance={usdcBalance}
            setShowFund={setShowFund}
            status={status}
          />
        </div>
      </div>
      
      <VerifyWalletModal open={!isAuthed && showVerify} onOpenChange={setShowVerify} />
      {isAuthed && (
        <FundWalletModal open={showFund} onOpenChange={setShowFund} />
      )}
    </div>
  );
};

const Chat = ({ serverData, chatId }: ChatProps) => {
  const [showFund, setShowFund] = useState(false);
  const [showVerify, setShowVerify] = useState(!serverData.isAuthed);
  const router = useRouter();
  
  const createNewChat = () => {
    router.push('/chat');
  };
  console.log("chatMessages", serverData.chatMessages);
  return (
    <ChatContent
      currentChatId={chatId}
      createNewChat={createNewChat}
      currentChat={serverData.currentChat ?? undefined}
      chatMessages={serverData.chatMessages}
      isAuthed={serverData.isAuthed}
      showVerify={showVerify}
      setShowVerify={setShowVerify}
      usdcBalance={serverData.usdcBalance ?? undefined}
      showFund={showFund}
      setShowFund={setShowFund}
    />
  );
};

export default Chat;
