'use client';

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
} from '@/components/ui/ai-elements/prompt-input';

import { ToolSelector } from '../tool-selector';

import type { ChatStatus } from '../chat';

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

interface PromptInputSectionProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  model: string;
  setModel: (value: string) => void;
  selectedTools: string[];
  setSelectedTools: (value: string[]) => void;
  status: ChatStatus;
}

export const PromptInputSection = ({
  input,
  setInput,
  handleSubmit,
  model,
  setModel,
  selectedTools,
  setSelectedTools,
}: PromptInputSectionProps) => {
  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setInput(e.target.value)
        }
        value={input}
      />
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputModelSelect
            onValueChange={value => {
              setModel(value);
            }}
            value={model}
          >
            <PromptInputModelSelectTrigger>
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

          <ToolSelector
            selectedTools={selectedTools}
            onToolsChange={setSelectedTools}
          />
        </PromptInputTools>
        <PromptInputSubmit disabled={!input} />
      </PromptInputToolbar>
    </PromptInput>
  );
};
