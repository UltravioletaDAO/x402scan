import { LanguageModelCapability, type LanguageModel } from '../types';

const perplexityModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Sonar Pro',
    modelId: 'sonar-pro',
    description: 'Next-generation Sonar with enhanced reasoning',
    capabilities: [LanguageModelCapability.WebSearch],
    bestFor: ['Complex reasoning', 'Advanced analysis', 'Research'],
    contextLength: 2000000,
  },
  {
    name: 'Sonar',
    modelId: 'sonar',
    description: 'Fast version of Sonar for quick responses',
    capabilities: [LanguageModelCapability.WebSearch],
    bestFor: ['Quick tasks', 'Real-time responses', 'Efficient processing'],
    contextLength: 1000000,
  },
];

export const perplexityModels: LanguageModel[] = perplexityModelData.map(
  model => ({
    ...model,
    provider: 'perplexity',
  })
);
