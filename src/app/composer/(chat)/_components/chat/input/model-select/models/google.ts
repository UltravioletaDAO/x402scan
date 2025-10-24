import { LanguageModelCapability, type LanguageModel } from '../types';

const googleModelData: Omit<LanguageModel, 'provider'>[] = [
  {
    name: 'Gemini 2.5 Flash Image (Nano Banana)',
    modelId: 'gemini-2.5-flash-image',
    description:
      'State-of-the-art image generation with contextual understanding and edits.',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Image generation', 'Image editing', 'Multimodal chat'],
    contextLength: 33000,
    isNew: true,
  },
  {
    name: 'Gemini 2.5 Flash Preview 09-2025',
    modelId: 'gemini-2.5-flash-preview-09-2025',
    description:
      'Workhorse model for reasoning, coding, math, and science with thinking.',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Advanced reasoning', 'Coding', 'Scientific tasks'],
    contextLength: 1050000,
    isNew: true,
  },
  {
    name: 'Gemini 2.5 Flash Lite Preview 09-2025',
    modelId: 'gemini-2.5-flash-lite-preview-09-2025',
    description:
      'Lightweight reasoning model optimized for ultra-low latency and cost.',
    capabilities: [
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Throughput', 'Quick responses', 'Cost-efficient tasks'],
    contextLength: 1050000,
    isNew: true,
  },
  {
    name: 'Gemini 2.5 Flash Image Preview (Nano Banana)',
    modelId: 'gemini-2.5-flash-image-preview',
    description:
      'Preview of image generation with contextual understanding and edits.',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Image generation', 'Edits', 'Visual chat'],
    contextLength: 33000,
  },
  {
    name: 'Gemini 2.5 Flash Lite',
    modelId: 'gemini-2.5-flash-lite',
    description:
      'Lightweight model with improved throughput and faster generation.',
    capabilities: [
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Low-latency apps', 'Cost-efficient workloads'],
    contextLength: 1050000,
  },
  {
    name: 'Gemma 3n 2B',
    modelId: 'gemma-3n-2b',
    description:
      'Multimodal, instruction-tuned 2B effective parameter model for efficiency.',
    capabilities: [LanguageModelCapability.ToolCalling],
    bestFor: ['Lightweight tasks', 'Low-resource deployment'],
    contextLength: 8000,
  },
  {
    name: 'Gemini 2.5 Flash Lite Preview 06-17',
    modelId: 'gemini-2.5-flash-lite-preview-06-17',
    description:
      'Preview of Flash-Lite with improved throughput and low-latency focus.',
    capabilities: [
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.ToolCalling,
      LanguageModelCapability.Vision,
      LanguageModelCapability.Pdf,
    ],
    bestFor: ['Throughput', 'Quick tasks', 'Cost efficiency'],
    contextLength: 1050000,
  },
  {
    name: 'Gemini 2.5 Flash',
    modelId: 'gemini-2.5-flash',
    description:
      'Workhorse model for advanced reasoning, coding, math, and scientific tasks.',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Advanced reasoning', 'Coding', 'Scientific analysis'],
    contextLength: 1050000,
  },
  {
    name: 'Gemini 2.5 Pro',
    modelId: 'gemini-2.5-pro',
    description: 'Next-generation Gemini with enhanced reasoning capabilities.',
    capabilities: [
      LanguageModelCapability.Vision,
      LanguageModelCapability.Reasoning,
      LanguageModelCapability.Pdf,
      LanguageModelCapability.ToolCalling,
    ],
    bestFor: ['Complex reasoning', 'Research', 'Enterprise workloads'],
    contextLength: 2000000,
  },
];

export const googleModels: LanguageModel[] = googleModelData.map(model => ({
  ...model,
  provider: 'google',
}));
