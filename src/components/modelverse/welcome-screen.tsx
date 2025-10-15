"use client";

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sparkles, ChevronDown } from 'lucide-react';
import type { Model } from '@/lib/types';
import { MODELS, ALL_MODELS_OPTION } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface WelcomeScreenProps {
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (prompt: string) => void;
  onModelSelect: (modelId: string) => void;
  selectedModel: Model | null;
}

const ALL_AVAILABLE_MODELS = [ALL_MODELS_OPTION, ...MODELS];


export function WelcomeScreen({
  suggestions,
  isLoading,
  onSuggestionClick,
  onModelSelect,
  selectedModel,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      
      <div className="mb-8">
        <Select
            value={selectedModel?.id}
            onValueChange={onModelSelect}
          >
          <SelectTrigger className="w-72 h-14 text-lg font-semibold rounded-xl border-2">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {ALL_AVAILABLE_MODELS.map((model, index) => (
              <React.Fragment key={model.id}>
                {model.id === 'gemini' && <Separator className="my-1" />}
                <SelectItem value={model.id}>
                  <div className="flex items-center gap-3">
                    <model.Icon className="w-5 h-5" />
                    <span>{model.name}</span>
                  </div>
                </SelectItem>
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            : suggestions.slice(0, 4).map((prompt, i) => (
                <Card
                  key={i}
                  onClick={() => onSuggestionClick(prompt)}
                  className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md bg-card border-border/50 text-left rounded-xl"
                >
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">{prompt}</p>
                    <p className="text-xs text-muted-foreground mt-2">for {selectedModel?.name}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}
