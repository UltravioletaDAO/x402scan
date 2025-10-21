import { type LanguageModel, LanguageModelCapability } from '../types';

const deepseekModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'DeepSeek 3',
    modelId: 'deepseek-chat-v3-0324',
    description:
      'DeepSeek 3 is the latest generation of DeepSeek models with enhanced capabilities',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['Advanced reasoning', 'Code generation', 'Creative writing'],
    contextLength: 131072,
  },
];

export const deepseekModels: LanguageModel[] = deepseekModelData.map(model => ({
  ...model,
  provider: 'deepseek',
}));
