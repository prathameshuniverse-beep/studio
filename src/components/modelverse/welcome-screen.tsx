"use client";

import React from 'react';
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
    <div className="flex flex-col items-center justify-center h-full text-center p-2">
      
      <div className="mb-8">
        <Select
            value={selectedModel?.id}
            onValueChange={onModelSelect}
          >
          <SelectTrigger className="w-full max-w-xs sm:w-72 h-16 text-lg font-medium rounded-full border-2">
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

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))
            : suggestions.slice(0, 4).map((prompt, i) => (
                <Card
                  key={i}
                  onClick={() => onSuggestionClick(prompt)}
                  className="cursor-pointer transition-all hover:bg-muted/50 hover:border-primary/50 text-left rounded-2xl"
                >
                  <CardContent className="p-4">
                    <p className="font-medium">{prompt}</p>
                    <p className="text-sm text-muted-foreground mt-2">for {selectedModel?.name}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}
