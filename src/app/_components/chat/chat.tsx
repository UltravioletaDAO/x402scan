'use client';

import { useChat } from '@ai-sdk/react';
import { CopyIcon, MessageSquare } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Action, Actions } from '@/app/_components/chat/ai-elements/actions';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/app/_components/chat/ai-elements/conversation';
import { Loader } from '@/app/_components/chat/ai-elements/loader';
import { Message, MessageContent } from '@/app/_components/chat/ai-elements/message';
import {
  PromptInput,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/app/_components/chat/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/app/_components/chat/ai-elements/reasoning';
import { Response } from '@/app/_components/chat/ai-elements/response';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from '@/app/_components/chat/ai-elements/tool';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/app/_components/chat/ai-elements/sources';
import { Suggestion, Suggestions } from '@/app/_components/chat/ai-elements/suggestion';
import { ToolSelector } from '@/app/_components/chat/tool-selector';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import { VerifyWalletModal } from '@/app/_components/chat/verify-wallet-modal';
import { FundWalletModal } from '@/app/_components/chat/fund-wallet-modal';
import { PromptInputButton } from '@/app/_components/chat/ai-elements/prompt-input';
import { Wallet } from 'lucide-react';
import { api } from '@/trpc/client';
import { isToolUIPart, ToolUIPart } from 'ai';

const models = [
  {
    name: 'GPT 4o',
    value: 'gpt-4o',
  },
  {
    name: 'GPT 5',
    value: 'gpt-5',
  },
];

const suggestions = [
  'Can you explain how to play tennis?',
  'Write me a code snippet of how to use the vercel ai sdk to create a chatbot',
];

const Chat = () => {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { messages, sendMessage, status } = useChat();
  const { status: authStatus } = useSession();
  const isAuthed = authStatus === 'authenticated';
  const [showVerify, setShowVerify] = useState(false);
  const [showFund, setShowFund] = useState(false);

  const { address } = useAccount();

  const { data: usdcBalance } = api.serverWallet.usdcBaseBalance.useQuery(undefined, {
    enabled: isAuthed,
  });
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      setShowVerify(true);
    } else if (authStatus === 'authenticated') {
      setShowVerify(false);
    }
  }, [authStatus, address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthed) {
      return;
    }
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: model,
            selectedTools: selectedTools,
          },
        }
      );
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isAuthed) {
      return;
    }
    sendMessage(
      { text: suggestion },
      {
        body: {
          model: model,
          selectedTools: selectedTools,
        },
      }
    );
  };

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col p-6">
      <div className="flex h-full min-h-0 flex-col">
        <Conversation className="relative min-h-0 w-full flex-1 overflow-hidden">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="No messages yet"
                description="Start a conversation to see messages here"
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
                            message.parts.filter(
                              part => part.type === 'source-url'
                            ).length
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
        <Suggestions>
          {suggestions.map(suggestion => (
            <Suggestion
              key={suggestion}
              onClick={handleSuggestionClick}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>

        <PromptInput onSubmit={handleSubmit} className="mt-4 flex-shrink-0">
          <PromptInputTextarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            value={input}
            disabled={!isAuthed}
            placeholder={isAuthed ? undefined : 'Sign in to chat'}
          />
          <PromptInputToolbar>
            <PromptInputTools className={!isAuthed ? 'pointer-events-none opacity-50' : undefined}>
              <PromptInputModelSelect
                onValueChange={value => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger disabled={!isAuthed}>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map(model => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
              <PromptInputButton
                onClick={() => setShowFund(true)}
                disabled={!isAuthed}
                aria-label="Fund wallet"
              >
                <Wallet className="size-4" />
                ${usdcBalance?.toPrecision(3)} USDC
              </PromptInputButton>
              <ToolSelector
                selectedTools={selectedTools}
                onToolsChange={setSelectedTools}
              />
            </PromptInputTools>
            <PromptInputSubmit disabled={!input || !isAuthed} status={status} />
          </PromptInputToolbar>
        </PromptInput>
        <VerifyWalletModal open={!isAuthed && showVerify} onOpenChange={setShowVerify} />
        {isAuthed && (
          <FundWalletModal open={showFund} onOpenChange={setShowFund} />
        )}
      </div>
    </div>
  );
};

export default Chat;
