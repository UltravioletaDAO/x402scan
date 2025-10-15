'use client';

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ui/ai-elements/prompt-input';

import { ToolSelector } from './tool-selector';
import { ModelSelect } from './model-select';

import type { ChatStatus } from '../chat';
import { WalletButton } from './wallet';

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
          <ModelSelect model={model} setModel={setModel} />
          <ToolSelector
            selectedTools={selectedTools}
            onToolsChange={setSelectedTools}
          />
          <WalletButton />
        </PromptInputTools>
        <PromptInputSubmit disabled={!input} className="size-8 md:size-8" />
      </PromptInputToolbar>
    </PromptInput>
  );
};
