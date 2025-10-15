"use client";

import { BrainCircuitIcon } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (prompt: string) => void;
}

export function WelcomeScreen({
  suggestions,
  isLoading,
  onSuggestionClick,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <BrainCircuitIcon className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-3xl font-bold tracking-tight">Welcome to ModelVerse</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Select a model and start a conversation. Not sure where to begin? Try one
        of the suggestions below.
      </p>

      <div className="mt-12 w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Suggestions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            : suggestions.slice(0, 4).map((prompt, i) => (
                <Card
                  key={i}
                  onClick={() => onSuggestionClick(prompt)}
                  className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                >
                  <CardContent className="p-4 text-left">
                    <p className="text-sm">{prompt}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}
