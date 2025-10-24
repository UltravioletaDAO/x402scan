import { type LanguageModel, LanguageModelCapability } from '../types';

const llamaModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Llama 3.3 8B Instruct',
    modelId: 'llama-3.3-8b-instruct',
    description:
      'Lightweight and ultra-fast variant of Llama 3.3 70B for quick responses.',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['Quick responses', 'Assistant tasks', 'Cost-sensitive apps'],
    contextLength: 128000,
  },
  {
    name: 'Llama Guard 4 12B',
    modelId: 'llama-guard-4-12b',
    description:
      'Multimodal safety classification for inputs and responses; supports text and images.',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
    ],
    bestFor: ['Safety classification', 'Moderation', 'Policy enforcement'],
    contextLength: 164000,
  },
  {
    name: 'Llama 4 Maverick',
    modelId: 'meta-llama/llama-4-maverick',
    description:
      'High-capacity multimodal MoE model optimized for vision-language tasks.',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
    ],
    bestFor: ['Multimodal reasoning', 'Assistant behavior', 'High throughput'],
    contextLength: 1050000,
  },
  {
    name: 'Llama 4 Scout',
    modelId: 'llama-4-scout',
    description:
      'Efficient MoE model for multilingual assistant interaction and visual reasoning.',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
    ],
    bestFor: ['Multimodal chat', 'Captioning', 'Image understanding'],
    contextLength: 10000000,
  },
  {
    name: 'Llama Guard 3 8B',
    modelId: 'llama-guard-3-8b',
    description:
      'Safety classification model aligned to MLCommons hazards taxonomy.',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['Prompt moderation', 'Response moderation', 'Policy tagging'],
    contextLength: 160000,
  },
  {
    name: 'Llama 3.3 70B Instruct',
    modelId: 'llama-3.3-70b-instruct',
    description:
      'Multilingual, instruction-tuned model for high-quality dialogue use cases.',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['General purpose', 'Complex reasoning', 'Code generation'],
    contextLength: 131072,
  },
];

export const llamaModels: LanguageModel[] = llamaModelData.map(model => ({
  ...model,
  provider: 'meta-llama',
}));
