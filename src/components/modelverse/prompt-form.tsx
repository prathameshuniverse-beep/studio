"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal, LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

const promptSchema = z.object({
  prompt: z.string().min(1, { message: 'Prompt cannot be empty.' }),
});

type PromptFormValues = z.infer<typeof promptSchema>;

interface PromptFormProps {
  onSubmit: (data: PromptFormValues) => void;
  isLoading: boolean;
  prompt: string;
}

export function PromptForm({ onSubmit, isLoading, prompt }: PromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: prompt || '',
    },
  });
  
  useEffect(() => {
    form.reset({ prompt });
  }, [prompt, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your prompt here..."
                  className="min-h-24 pr-28 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 bottom-3"
          size="lg"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <SendHorizonal />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </Form>
  );
}
