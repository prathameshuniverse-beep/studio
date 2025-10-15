"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sparkles, ChevronDown } from 'lucide-react';
import type { Model } from '@/lib/types';
import { MODELS } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WelcomeScreenProps {
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (prompt: string) => void;
  onModelSelect: (modelId: string) => void;
  selectedModel: Model | null;
}

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
          <SelectTrigger className="w-64 h-14 text-lg font-semibold rounded-xl border-2">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center gap-2">
                  <model.Icon className="w-4 h-4" />
                  <span>{model.name}</span>
                </div>
              </SelectItem>
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
