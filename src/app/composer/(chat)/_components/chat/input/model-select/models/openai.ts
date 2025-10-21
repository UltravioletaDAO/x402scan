import { LanguageModelCapability, type LanguageModel } from '../types';

const openAiLanguageModelsData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'GPT-4.1',
    modelId: 'gpt-4.1',
    description: 'Enhanced version with improved capabilities',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['General purpose', 'Improved performance', 'Reliability'],
    contextLength: 128000,
  },
  {
    name: 'GPT-4.1 Mini',
    modelId: 'gpt-4.1-mini',
    description: 'Compact version for efficiency',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Quick responses', 'Cost-effective', 'Simple tasks'],
    contextLength: 128000,
  },
  {
    name: 'GPT-4.1 Nano',
    modelId: 'gpt-4.1-nano',
    description: 'Ultra-compact model for basic tasks',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Simple queries', 'Ultra-fast', 'Basic assistance'],
    contextLength: 32000,
  },
  {
    name: 'GPT-4o',
    modelId: 'gpt-4o',
    description: 'Most advanced multimodal model with vision and reasoning',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Multimodal tasks', 'Vision analysis', 'Code generation'],
    contextLength: 128000,
  },
  {
    name: 'GPT-4o Mini',
    modelId: 'gpt-4o-mini',
    description: 'Smaller, faster version of GPT-4o',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Quick tasks', 'Cost-effective', 'Simple queries'],
    contextLength: 128000,
  },
  {
    name: 'GPT-4o Search Preview',
    modelId: 'gpt-4o-search-preview',
    description: 'GPT-4o with web search capabilities',
    capabilities: [LanguageModelCapability.WebSearch],
    bestFor: ['Research', 'Current events', 'Fact-checking'],
    contextLength: 128000,
  },
  {
    name: 'GPT-4o Mini Search',
    modelId: 'gpt-4o-mini-search',
    description: 'GPT-4o with web search capabilities',
    capabilities: [LanguageModelCapability.WebSearch],
    bestFor: ['Research', 'Current events', 'Fact-checking'],
    contextLength: 128000,
  },
  {
    name: 'O3 Mini',
    modelId: 'o3-mini',
    description: 'Next-generation reasoning model',
    capabilities: [
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Advanced reasoning', 'Complex problems', 'Research'],
    contextLength: 200000,
  },
  {
    name: 'O3',
    modelId: 'o3',
    description: 'Most advanced reasoning model',
    capabilities: [
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.Vision,
    ],
    bestFor: ['Complex reasoning', 'Research', 'Advanced analysis'],
    contextLength: 200000,
  },
  {
    name: 'O1',
    modelId: 'o1',
    description: 'Advanced reasoning model for complex problems',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Complex reasoning', 'Math', 'Science', 'Research'],
    contextLength: 200000,
  },
  {
    name: 'O4 Mini',
    modelId: 'o4-mini',
    description: 'Latest generation reasoning model',
    capabilities: [
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.Vision,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Advanced reasoning', 'Complex tasks', 'Research'],
    contextLength: 200000,
  },
];

export const openAiLanguageModels: LanguageModel[] =
  openAiLanguageModelsData.map(model => ({
    ...model,
    provider: 'openai',
  }));
