"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Markdown } from './markdown';
import type { Model, IndividualResponse } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Sparkles } from 'lucide-react';
import { ALL_MODELS_ID } from '@/lib/constants';

interface ResponseDisplayProps {
  prompt: string;
  response: string | IndividualResponse[];
  summary: string;
  isLoading: boolean;
  model: Model | null;
}

const LoadingSkeleton = () => (
  <div className="space-y-2 pt-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

export function ResponseDisplay({
  prompt,
  response,
  summary,
  isLoading,
  model,
}: ResponseDisplayProps) {

  const renderSingleResponse = (res: string) => (
    <div className="flex items-start gap-4">
      <Avatar className="border-2 border-transparent">
        <AvatarFallback className="bg-transparent">
          {model && <model.Icon className="w-8 h-8 text-primary" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="font-semibold text-primary">{model?.name || "Model"} Response</p>
        {isLoading && !res ? (
          <LoadingSkeleton />
        ) : (
          <Markdown content={res} />
        )}
      </div>
    </div>
  );

  const renderAllResponses = (responses: IndividualResponse[]) => (
    <>
      {isLoading && !responses.length ? (
        // Show skeletons for all models while loading
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
             <Avatar className='border-2 border-transparent'>
                <AvatarFallback className="bg-transparent">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse"/>
                </AvatarFallback>
             </Avatar>
             <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32 mb-2" />
                <LoadingSkeleton />
             </div>
          </div>
        ))
      ) : (
        responses.map(({ model: responseModel, response: res }) => (
          <div key={responseModel.id} className="flex items-start gap-4">
            <Avatar className='border-2 border-transparent'>
              <AvatarFallback className="bg-transparent">
                <responseModel.Icon className="w-8 h-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-primary">{responseModel.name} Response</p>
              <Markdown content={res} />
            </div>
          </div>
        ))
      )}
    </>
  );

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

      {/* Model Response(s) */}
      {model?.id === ALL_MODELS_ID ? 
        renderAllResponses(Array.isArray(response) ? response : []) : 
        renderSingleResponse(typeof response === 'string' ? response : '')
      }
    </div>
  );
}
