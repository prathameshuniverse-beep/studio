'use server';
/**
 * @fileOverview Flow for generating starting prompts based on the selected AI model.
 *
 * - generateStartingPrompts - A function that generates starting prompts.
 * - GenerateStartingPromptsInput - The input type for the generateStartingPrompts function.
 * - GenerateStartingPromptsOutput - The return type for the generateStartingPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStartingPromptsInputSchema = z.object({
  modelName: z.string().describe('The name of the selected AI model.'),
});
export type GenerateStartingPromptsInput = z.infer<typeof GenerateStartingPromptsInputSchema>;

const GenerateStartingPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of suggested starting prompts.'),
});
export type GenerateStartingPromptsOutput = z.infer<typeof GenerateStartingPromptsOutputSchema>;

export async function generateStartingPrompts(input: GenerateStartingPromptsInput): Promise<GenerateStartingPromptsOutput> {
  return generateStartingPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStartingPromptsPrompt',
  input: {schema: GenerateStartingPromptsInputSchema},
  output: {schema: GenerateStartingPromptsOutputSchema},
  prompt: `You are an AI assistant that suggests starting prompts for different AI models.

  Based on the selected AI model ({{{modelName}}}), suggest five diverse starting prompts that showcase the model's capabilities.  These prompts should be useful to a new user who is unfamiliar with the model.

  Return the prompts as a JSON array of strings.
  `,
});

const generateStartingPromptsFlow = ai.defineFlow(
  {
    name: 'generateStartingPromptsFlow',
    inputSchema: GenerateStartingPromptsInputSchema,
    outputSchema: GenerateStartingPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
