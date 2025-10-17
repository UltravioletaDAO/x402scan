'use client';

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';

import { ModelSelect } from './model-select';

import { ToolSelect } from './resources-select';

import type { ChatStatus } from 'ai';
import { api } from '@/trpc/client';
import { useSession } from 'next-auth/react';

interface Props {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  model: string;
  setModel: (value: string) => void;
  selectedResourceIds: string[];
  onSelectResource: (resourceId: string) => void;
  status: ChatStatus;
}

export const PromptInputSection: React.FC<Props> = ({
  input,
  setInput,
  handleSubmit,
  model,
  setModel,
  selectedResourceIds,
  onSelectResource,
}) => {
  const { data: session } = useSession();

  const { data: usdcBalance } = api.serverWallet.usdcBaseBalance.useQuery(
    undefined,
    {
      enabled: !!session,
    }
  );

  const hasBalance = usdcBalance && usdcBalance > 0;

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setInput(e.target.value)
        }
        value={input}
        disabled={!hasBalance}
      />
      <PromptInputToolbar>
        <PromptInputTools>
          <ModelSelect model={model} setModel={setModel} />
          <ToolSelect
            resourceIds={selectedResourceIds}
            onSelectResource={onSelectResource}
          />
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!input || !hasBalance}
          className="size-8 md:size-8"
        />
      </PromptInputToolbar>
    </PromptInput>
  );
};
