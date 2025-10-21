import { LanguageModelCapability, type LanguageModel } from '../types';

const anthropicModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Claude 3.7 Sonnet',
    modelId: 'claude-3.7-sonnet',
    description: 'Enhanced version with improved capabilities',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Code review', 'Content creation', 'Problem solving'],
    contextLength: 200000,
  },
  {
    name: 'Claude 4 Opus',
    modelId: 'claude-opus-4',
    description: 'Most powerful model for complex reasoning and creative tasks',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Complex analysis', 'Creative writing', 'Research'],
    contextLength: 200000,
  },
  {
    name: 'Claude Sonnet 4',
    modelId: 'claude-sonnet-4',
    description: 'Balanced performance for most tasks with improved reasoning',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['General purpose', 'Code generation', 'Analysis'],
    contextLength: 200000,
  },
  {
    name: 'Claude 3.5 Haiku',
    modelId: 'claude-3.5-haiku',
    description: 'Fastest model for near-instant responsiveness',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Quick responses', 'Simple queries', 'Real-time chat'],
    contextLength: 200000,
  },
  {
    name: 'Claude 3.5 Sonnet',
    modelId: 'claude-3.5-sonnet',
    description: 'Balanced performance and speed for most use cases',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['General purpose', 'Code assistance', 'Writing'],
    contextLength: 200000,
  },
] as const;

export const anthropicModels: LanguageModel[] = anthropicModelData.map(
  model => ({
    ...model,
    provider: 'anthropic',
  })
);
