import { GptIcon, LlamaIcon, GeminiIcon } from '@/components/icons';
import type { Model } from '@/lib/types';

export const MODELS: Model[] = [
  { id: 'gemini', name: 'Gemini', Icon: GeminiIcon },
  { id: 'gpt-4', name: 'GPT-4', Icon: GptIcon },
  { id: 'llama-3', name: 'Llama 3', Icon: LlamaIcon },
];

export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 1024;
