"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MODELS } from '@/lib/constants';

const apiKeysSchema = z.object(
  Object.fromEntries(
    MODELS.filter(m => m.id !== 'gemini').map((model) => [model.id, z.string().optional()])
  )
);

type ApiKeysFormValues = z.infer<typeof apiKeysSchema>;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { toast } = useToast();

  const getSavedKeys = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return {};
    }
    const savedKeys = localStorage.getItem('model-api-keys');
    return savedKeys ? JSON.parse(savedKeys) : {};
  }, []);

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: getSavedKeys(),
  });

  React.useEffect(() => {
    if (open) {
      form.reset(getSavedKeys());
    }
  }, [open, form, getSavedKeys]);

  const onSubmit = (data: ApiKeysFormValues) => {
    localStorage.setItem('model-api-keys', JSON.stringify(data));
    toast({
      title: 'Success',
      description: 'API keys saved successfully.',
    });
    onOpenChange(false);
  };

  const modelsWithKeys = MODELS.filter((model) => model.id !== 'gemini');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Enter your API keys for the models you want to use. Keys are stored
            in your browser's local storage.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-96 overflow-y-auto p-1 pr-4">
              <div className="space-y-4">
                {modelsWithKeys.map((model) => (
                  <FormField
                    key={model.id}
                    control={form.control}
                    name={model.id as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <model.Icon className="w-4 h-4" />
                          {model.name} API Key
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} value={field.value || ''}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
