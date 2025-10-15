"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal, LoaderCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    form.reset({ prompt });
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt, form]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if(textareaRef.current){
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

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
                  ref={textareaRef}
                  placeholder="Enter your prompt here..."
                  className="min-h-12 pr-16 resize-none rounded-full border-2 border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background p-4"
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading || !form.watch('prompt')}
          className="absolute right-2 bottom-2 rounded-full"
          size="icon"
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
