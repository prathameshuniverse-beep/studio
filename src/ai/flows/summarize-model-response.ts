'use server';

/**
 * @fileOverview Summarizes AI model responses into key takeaways.
 *
 * - summarizeModelResponse - A function that summarizes the model response.
 * - SummarizeModelResponseInput - The input type for the summarizeModelResponse function.
 * - SummarizeModelResponseOutput - The return type for the summarizeModelResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeModelResponseInputSchema = z.object({
  modelResponse: z
    .string()
    .describe('The complete, original response from the AI model.'),
});
export type SummarizeModelResponseInput = z.infer<typeof SummarizeModelResponseInputSchema>;

const SummarizeModelResponseOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key takeaways from the model response.'),
});
export type SummarizeModelResponseOutput = z.infer<typeof SummarizeModelResponseOutputSchema>;

export async function summarizeModelResponse(
  input: SummarizeModelResponseInput
): Promise<SummarizeModelResponseOutput> {
  return summarizeModelResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeModelResponsePrompt',
  input: {schema: SummarizeModelResponseInputSchema},
  output: {schema: SummarizeModelResponseOutputSchema},
  prompt: `You are an expert summarizer, skilled at condensing long pieces of text into short, easy to understand summaries.  Your goal is to identify the key takeaways from the following AI model response, and present them in a concise summary.

AI Model Response:
{{{modelResponse}}}`,
});

const summarizeModelResponseFlow = ai.defineFlow(
  {
    name: 'summarizeModelResponseFlow',
    inputSchema: SummarizeModelResponseInputSchema,
    outputSchema: SummarizeModelResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
