import {
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from '@/components/ai-elements/prompt-input';

interface Props {
  model: string;
  setModel: (value: string) => void;
}

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

export const ModelSelect = ({ model, setModel }: Props) => {
  return (
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
          <PromptInputModelSelectItem key={model.value} value={model.value}>
            {model.name}
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
};
