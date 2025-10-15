import {
  GptIcon,
  LlamaIcon,
  GeminiIcon,
  ClaudeIcon,
  PerplexityIcon,
  CopilotIcon,
  MetaIcon,
  GemmaIcon,
  DeepseekIcon,
  BrainCircuitIcon,
} from '@/components/icons';
import type { Model } from '@/lib/types';

export const ALL_MODELS_ID = 'all-models';

export const MODELS: Model[] = [
  { id: 'gemini', name: 'Gemini', Icon: GeminiIcon },
  { id: 'gpt-4', name: 'GPT-4', Icon: GptIcon },
  { id: 'llama-3', name: 'Llama 3', Icon: LlamaIcon },
  { id: 'claude', name: 'Claude', Icon: ClaudeIcon },
  { id: 'perplexity', name: 'Perplexity', Icon: PerplexityIcon },
  { id: 'copilot', name: 'Microsoft Copilot', Icon: CopilotIcon },
  { id: 'meta-ai', name: 'Meta AI', Icon: MetaIcon },
  { id: 'gemma', name: 'Gemma', Icon: GemmaIcon },
  { id: 'deepseek', name: 'DeepSeek', Icon: DeepseekIcon },
];

export const ALL_MODELS_OPTION: Model = {
  id: ALL_MODELS_ID,
  name: 'All GenAI LLM Models',
  Icon: BrainCircuitIcon,
};

export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 1024;
