"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Markdown } from './markdown';
import type { Model } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ResponseDisplayProps {
  prompt: string;
  response: string;
  summary: string;
  isLoading: boolean;
  model: Model | null;
}

export function ResponseDisplay({
  prompt,
  response,
  summary,
  isLoading,
  model,
}: ResponseDisplayProps) {
  return (
    <div className="space-y-8">
       {/* User Prompt */}
       <div className="flex items-start gap-4">
            <Avatar className='border-2 border-primary'>
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <p className="font-semibold text-primary">Your Prompt</p>
                <p className="text-foreground/90">{prompt}</p>
            </div>
        </div>

      {/* Model Response */}
      <div className="flex items-start gap-4">
        <Avatar className='border-2 border-transparent'>
            <AvatarFallback className="bg-transparent">
                {model && <model.Icon className="w-8 h-8 text-primary" />}
            </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <p className="font-semibold text-primary">{model?.name || "Model"} Response</p>
          {isLoading && !response ? (
             <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
             </div>
          ) : (
            <Markdown content={response} />
          )}
        </div>
      </div>
    </div>
  );
}
