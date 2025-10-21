import { LanguageModelCapability, type LanguageModel } from '../types';

const xaiLanguageModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Grok 4',
    modelId: 'grok-4',
    description: 'Latest generation Grok model with enhanced capabilities',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
    ],
    bestFor: ['General purpose', 'Real-time information', 'Analysis'],
    contextLength: 256000,
  },
  {
    name: 'Grok 3',
    modelId: 'grok-3',
    description: 'Previous generation Grok model with enhanced capabilities',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['General purpose', 'Real-time information', 'Analysis'],
    contextLength: 128000,
  },
  {
    name: 'Grok 3 Mini',
    modelId: 'grok-3-mini-beta',
    description: 'Compact version for efficient processing',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Reasoning,
    ],
    bestFor: ['Cost-effective', 'Simple queries', 'Quick tasks'],
    contextLength: 128000,
  },
  {
    name: 'Grok 2',
    modelId: 'grok-2-1212',
    description: 'Advanced conversational AI with real-time knowledge',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['Conversations', 'Real-time info', 'General purpose'],
    contextLength: 128000,
  },
  {
    name: 'Grok 2 Vision',
    modelId: 'grok-2-vision-1212',
    description: 'Grok 2 with image understanding capabilities',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Image analysis', 'Multimodal tasks', 'Visual content'],
    contextLength: 128000,
  },
];

export const xaiLanguageModels: LanguageModel[] = xaiLanguageModelData.map(
  model => ({
    ...model,
    provider: 'x-ai',
  })
);
