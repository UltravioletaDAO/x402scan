import { anthropicModels } from './anthropic';
import { googleModels } from './google';
import { openAiLanguageModels } from './openai';
import { xaiLanguageModels } from './xai';
import { perplexityModels } from './perplexity';
import { llamaModels } from './llama';
import { qwenModels } from './qwen';
import { deepseekModels } from './deepseek';

export const languageModels = [
  ...anthropicModels,
  ...googleModels,
  ...openAiLanguageModels,
  ...xaiLanguageModels,
  ...perplexityModels,
  ...llamaModels,
  ...qwenModels,
  ...deepseekModels,
];
