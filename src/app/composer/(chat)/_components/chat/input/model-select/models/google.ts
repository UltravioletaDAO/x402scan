import { LanguageModelCapability, type LanguageModel } from '../types';

const googleModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Gemini 2.0 Flash',
    modelId: 'gemini-2.0-flash-001',
    description: 'Balanced performance with multimodal capabilities',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.WebSearch,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Multimodal tasks', 'General purpose', 'Balanced performance'],
    contextLength: 1000000,
  },
  {
    name: 'Gemini 2.5 Pro Preview',
    modelId: 'gemini-2.5-pro-preview-06-05',
    description: 'Next-generation Gemini with enhanced reasoning',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.WebSearch,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Complex reasoning', 'Advanced analysis', 'Research'],
    contextLength: 2000000,
  },
  {
    name: 'Gemini 2.5 Flash Preview',
    modelId: 'gemini-2.5-flash',
    description: 'Fast version of Gemini 2.5 for quick responses',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.WebSearch,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Quick tasks', 'Real-time responses', 'Efficient processing'],
    contextLength: 1000000,
  },
  {
    name: 'Gemini 1.5 Pro',
    modelId: 'gemini-pro-1.5',
    description: 'Powerful model with large context window',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.WebSearch,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Long documents', 'Complex analysis', 'Deep reasoning'],
    contextLength: 2000000,
  },
  {
    name: 'Gemini 1.5 Flash',
    modelId: 'gemini-flash-1.5',
    description: 'Fast and efficient for everyday tasks',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.WebSearch,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Quick responses', 'General chat', 'Efficient processing'],
    contextLength: 1000000,
  },
  {
    name: 'Gemini 1.5 Flash 8B',
    modelId: 'gemini-flash-1.5-8b',
    description: 'Compact model optimized for speed',
    capabilities: [
      LanguageModelCapability.WebSearch,
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Ultra-fast responses', 'Simple tasks', 'Cost-effective'],
    contextLength: 1000000,
  },
];

export const googleModels: LanguageModel[] = googleModelData.map(model => ({
  ...model,
  provider: 'google',
}));
