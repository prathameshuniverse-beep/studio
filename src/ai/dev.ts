import { config } from 'dotenv';
config();

import '@/ai/flows/generate-starting-prompts.ts';
import '@/ai/flows/summarize-model-response.ts';