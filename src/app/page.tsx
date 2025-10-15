"use client";

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { getSuggestions, processPrompt, processPromptAll } from '@/app/actions';
import type { Model, Interaction, IndividualResponse } from '@/lib/types';
import { MODELS, ALL_MODELS_ID, ALL_MODELS_OPTION } from '@/lib/constants';
import { SidebarContent } from '@/components/modelverse/sidebar-content';
import { WelcomeScreen } from '@/components/modelverse/welcome-screen';
import { ResponseDisplay } from '@/components/modelverse/response-display';
import { PromptForm } from '@/components/modelverse/prompt-form';
import { HistoryPanel } from '@/components/modelverse/history-panel';

type AppState = {
  selectedModel: Model | null;
  temperature: number;
  maxTokens: number;
  isLoadingSuggestions: boolean;
  isGeneratingResponse: boolean;
  suggestions: string[];
  prompt: string;
  response: string | IndividualResponse[];
  summary: string;
  history: Interaction[];
  activeInteractionId: string | null;
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
      type: 'GENERATE_SINGLE_RESPONSE_SUCCESS';
      payload: { response: string; summary: string; prompt: string; model: Model };
    }
  | {
      type: 'GENERATE_ALL_RESPONSES_SUCCESS';
      payload: { responses: IndividualResponse[]; prompt: string; };
    }
  | { type: 'GENERATE_RESPONSE_ERROR' }
  | { type: 'NEW_CHAT' }
  | { type: 'LOAD_INTERACTION'; payload: string };

const initialState: AppState = {
  selectedModel: ALL_MODELS_OPTION,
  temperature: 0.7,
  maxTokens: 1024,
  isLoadingSuggestions: true,
  isGeneratingResponse: false,
  suggestions: [],
  prompt: '',
  response: '',
  summary: '',
  history: [],
  activeInteractionId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };
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
      return { 
        ...state, 
        isGeneratingResponse: true, 
        prompt: action.payload,
        response: '',
        summary: ''
      };
    case 'GENERATE_SINGLE_RESPONSE_SUCCESS': {
      const newInteraction: Interaction = {
        id: new Date().toISOString(),
        model: action.payload.model,
        prompt: action.payload.prompt,
        response: action.payload.response,
        summary: action.payload.summary,
      };
      return {
        ...state,
        isGeneratingResponse: false,
        response: action.payload.response,
        summary: action.payload.summary,
        prompt: action.payload.prompt,
        history: [newInteraction, ...state.history],
        activeInteractionId: newInteraction.id,
      };
    }
    case 'GENERATE_ALL_RESPONSES_SUCCESS': {
        const newInteraction: Interaction = {
          id: new Date().toISOString(),
          model: ALL_MODELS_OPTION,
          prompt: action.payload.prompt,
          response: action.payload.responses,
          summary: `Compared ${MODELS.length} models.`,
        };
        return {
          ...state,
          isGeneratingResponse: false,
          response: action.payload.responses,
          summary: newInteraction.summary,
          prompt: action.payload.prompt,
          history: [newInteraction, ...state.history],
          activeInteractionId: newInteraction.id,
        };
      }
    case 'GENERATE_RESPONSE_ERROR':
      return { ...state, isGeneratingResponse: false };
    case 'NEW_CHAT':
        return {
          ...state,
          prompt: '',
          response: '',
          summary: '',
          activeInteractionId: null,
          selectedModel: ALL_MODELS_OPTION,
        };
    case 'LOAD_INTERACTION': {
      const interaction = state.history.find(h => h.id === action.payload);
      if (interaction) {
        return {
          ...state,
          prompt: interaction.prompt,
          response: interaction.response,
          summary: interaction.summary,
          selectedModel: interaction.model,
          activeInteractionId: interaction.id,
        };
      }
      return state;
    }
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
    const model = [...MODELS, ALL_MODELS_OPTION].find((m) => m.id === modelId);
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
        if (state.selectedModel.id === ALL_MODELS_ID) {
            const results = await processPromptAll(data.prompt);
            dispatch({
                type: 'GENERATE_ALL_RESPONSES_SUCCESS',
                payload: { responses: results, prompt: data.prompt }
            })
        } else {
            const result = await processPrompt(data.prompt, state.selectedModel.name);
            dispatch({ 
                type: 'GENERATE_SINGLE_RESPONSE_SUCCESS', 
                payload: { ...result, prompt: data.prompt, model: state.selectedModel } 
            });
        }
    } catch (error) {
      dispatch({ type: 'GENERATE_RESPONSE_ERROR' });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the model(s).',
      });
    }
  };
  
  const onSuggestionClick = (prompt: string) => {
    dispatch({ type: 'SET_PROMPT', payload: prompt });
    handlePromptSubmit({ prompt });
  };

  const handleNewChat = () => {
    dispatch({ type: 'NEW_CHAT' });
  };

  const handleHistorySelect = (interactionId: string) => {
    dispatch({ type: 'LOAD_INTERACTION', payload: interactionId });
  };

  const activeInteraction = state.history.find(i => i.id === state.activeInteractionId);

  return (
    <SidebarProvider defaultOpen={false}>
       <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarContent 
            onNewChat={handleNewChat}
            onSettingsClick={() => {}} // Placeholder
          />
        </Sidebar>
        <HistoryPanel
            interactions={state.history}
            onSelectInteraction={handleHistorySelect}
            activeInteractionId={state.activeInteractionId}
        />
        <SidebarInset>
          <main className="flex-1 flex flex-col overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl w-full h-full">
              {(state.response || state.isGeneratingResponse) ? (
                <ResponseDisplay
                  prompt={state.prompt}
                  response={state.response}
                  summary={state.summary}
                  isLoading={state.isGeneratingResponse}
                  model={activeInteraction?.model || state.selectedModel}
                />
              ) : (
                <WelcomeScreen
                  suggestions={state.suggestions}
                  isLoading={state.isLoadingSuggestions}
                  onSuggestionClick={onSuggestionClick}
                  onModelSelect={handleModelSelect}
                  selectedModel={state.selectedModel}
                />
              )}
            </div>
            
            <div className="sticky bottom-0 w-full bg-background/95 backdrop-blur-sm mt-auto pt-4">
              <div className="mx-auto max-w-4xl">
                <PromptForm
                  onSubmit={handlePromptSubmit}
                  isLoading={state.isGeneratingResponse}
                  key={state.activeInteractionId || 'new-chat'} 
                  prompt={state.prompt}
                />
                 <p className="text-xs text-center text-muted-foreground p-2">
                    ModelVerse can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
