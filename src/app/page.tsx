"use client";

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { getSuggestions, processPrompt } from '@/app/actions';
import type { Model } from '@/lib/types';
import { MODELS } from '@/lib/constants';
import { SidebarContent } from '@/components/modelverse/sidebar-content';
import { WelcomeScreen } from '@/components/modelverse/welcome-screen';
import { ResponseDisplay } from '@/components/modelverse/response-display';
import { PromptForm } from '@/components/modelverse/prompt-form';

type AppState = {
  selectedModel: Model | null;
  temperature: number;
  maxTokens: number;
  isLoadingSuggestions: boolean;
  isGeneratingResponse: boolean;
  suggestions: string[];
  prompt: string;
  response: string;
  summary: string;
};

type AppAction =
  | { type: 'SET_MODEL'; payload: Model }
  | { type: 'SET_TEMPERATURE'; payload: number }
  | { type: 'SET_MAX_TOKENS'; payload: number }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'FETCH_SUGGESTIONS_START' }
  | { type: 'FETCH_SUGGESTIONS_SUCCESS'; payload: string[] }
  | { type: 'FETCH_SUGGESTIONS_ERROR' }
  | { type: 'GENERATE_RESPONSE_START'; payload: string }
  | {
      type: 'GENERATE_RESPONSE_SUCCESS';
      payload: { response: string; summary: string };
    }
  | { type: 'GENERATE_RESPONSE_ERROR' };

const initialState: AppState = {
  selectedModel: MODELS[0],
  temperature: 0.7,
  maxTokens: 1024,
  isLoadingSuggestions: true,
  isGeneratingResponse: false,
  suggestions: [],
  prompt: '',
  response: '',
  summary: '',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload, response: '', summary: '' };
    case 'SET_TEMPERATURE':
      return { ...state, temperature: action.payload };
    case 'SET_MAX_TOKENS':
      return { ...state, maxTokens: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'FETCH_SUGGESTIONS_START':
      return { ...state, isLoadingSuggestions: true, suggestions: [] };
    case 'FETCH_SUGGESTIONS_SUCCESS':
      return { ...state, isLoadingSuggestions: false, suggestions: action.payload };
    case 'FETCH_SUGGESTIONS_ERROR':
      return { ...state, isLoadingSuggestions: false };
    case 'GENERATE_RESPONSE_START':
      return { ...state, isGeneratingResponse: true, prompt: action.payload };
    case 'GENERATE_RESPONSE_SUCCESS':
      return {
        ...state,
        isGeneratingResponse: false,
        response: action.payload.response,
        summary: action.payload.summary,
      };
    case 'GENERATE_RESPONSE_ERROR':
      return { ...state, isGeneratingResponse: false };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.selectedModel) {
      dispatch({ type: 'FETCH_SUGGESTIONS_START' });
      getSuggestions(state.selectedModel.name)
        .then((prompts) => {
          dispatch({ type: 'FETCH_SUGGESTIONS_SUCCESS', payload: prompts });
        })
        .catch(() => {
          dispatch({ type: 'FETCH_SUGGESTIONS_ERROR' });
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch starting prompts.',
          });
        });
    }
  }, [state.selectedModel, toast]);

  const handleModelSelect = (modelId: string) => {
    const model = MODELS.find((m) => m.id === modelId);
    if (model) {
      dispatch({ type: 'SET_MODEL', payload: model });
    }
  };

  const handlePromptSubmit = async (data: { prompt: string }) => {
    if (!state.selectedModel) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a model first.',
      });
      return;
    }
    dispatch({ type: 'GENERATE_RESPONSE_START', payload: data.prompt });
    try {
      const result = await processPrompt(data.prompt, state.selectedModel.name);
      dispatch({ type: 'GENERATE_RESPONSE_SUCCESS', payload: result });
    } catch (error) {
      dispatch({ type: 'GENERATE_RESPONSE_ERROR' });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the model.',
      });
    }
  };
  
  const onSuggestionClick = (prompt: string) => {
    dispatch({ type: 'SET_PROMPT', payload: prompt });
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent
          selectedModel={state.selectedModel}
          onModelSelect={handleModelSelect}
          temperature={state.temperature}
          onTemperatureChange={(value) =>
            dispatch({ type: 'SET_TEMPERATURE', payload: value[0] })
          }
          maxTokens={state.maxTokens}
          onMaxTokensChange={(value) =>
            dispatch({ type: 'SET_MAX_TOKENS', payload: value[0] })
          }
        />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">
              {state.selectedModel?.name || 'ModelVerse'}
            </h1>
            <div className="w-7"></div>
          </div>
        </SidebarHeader>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl h-full">
            {state.response ? (
              <ResponseDisplay
                response={state.response}
                summary={state.summary}
                isLoading={state.isGeneratingResponse}
              />
            ) : (
              <WelcomeScreen
                suggestions={state.suggestions}
                isLoading={state.isLoadingSuggestions}
                onSuggestionClick={onSuggestionClick}
              />
            )}
          </div>
        </main>

        <footer className="p-4 md:p-6 border-t bg-background/95 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl">
            <PromptForm
              onSubmit={handlePromptSubmit}
              isLoading={state.isGeneratingResponse}
              key={state.prompt} // Re-mount form when suggestion is clicked
              prompt={state.prompt}
            />
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
