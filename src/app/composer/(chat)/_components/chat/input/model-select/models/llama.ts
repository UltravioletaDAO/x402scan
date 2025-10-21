import { type LanguageModel, LanguageModelCapability } from '../types';

const llamaModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Llama 4 Scout',
    modelId: 'llama-4-scout',
    description:
      'Llama 4 Scout 17B is an instruction-tuned model designed for following complex instructions',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
    ],
    bestFor: [
      'Instruction following',
      'Task automation',
      'Research assistance',
    ],
    contextLength: 131072,
  },

  {
    name: 'Llama 4 Maverick',
    modelId: 'meta-llama/llama-4-maverick',
    description:
      'Llama 4 Maverick 17B is an experimental instruction-tuned model with enhanced capabilities',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: [
      'Creative tasks',
      'Experimental applications',
      'Advanced reasoning',
    ],
    contextLength: 131072,
  },
  {
    name: 'Llama 3.3 70B',
    modelId: 'llama-3.3-70b-instruct',
    description:
      'Llama 3.3 70B is a versatile large language model optimized for various tasks',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['General purpose', 'Complex reasoning', 'Code generation'],
    contextLength: 131072,
  },
  {
    name: 'Llama 3.3 8B',
    modelId: 'llama-3.3-8b-instruct',
    description:
      'Llama 3.3 70B is a versatile large language model optimized for various tasks',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['General purpose', 'Complex reasoning', 'Code generation'],
    contextLength: 131072,
  },
];

export const llamaModels: LanguageModel[] = llamaModelData.map(model => ({
  ...model,
  provider: 'meta-llama',
}));
