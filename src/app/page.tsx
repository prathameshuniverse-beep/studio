
"use client";

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { getSuggestions, processPrompt, processPromptStream, processPromptAll, stopGeneration as stopGenerationAction } from '@/app/actions';
import type { Model, Interaction, IndividualResponse } from '@/lib/types';
import { MODELS, ALL_MODELS_ID, ALL_MODELS_OPTION } from '@/lib/constants';
import { SidebarContent } from '@/components/modelverse/sidebar-content';
import { WelcomeScreen } from '@/components/modelverse/welcome-screen';
import { ResponseDisplay } from '@/components/modelverse/response-display';
import { PromptForm } from '@/components/modelverse/prompt-form';
import { HistoryPanel } from '@/components/modelverse/history-panel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Square } from 'lucide-react';


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
  | { type: 'GENERATE_RESPONSE_STREAM'; payload: { text: string, flowId: string } }
  | {
      type: 'GENERATE_SINGLE_RESPONSE_SUCCESS';
      payload: { response: string; summary: string; prompt: string; model: Model };
    }
  | {
      type: 'GENERATE_ALL_RESPONSES_SUCCESS';
      payload: { responses: IndividualResponse[]; prompt: string; };
    }
  | { type: 'GENERATE_RESPONSE_ERROR' }
  | { type: 'STOP_GENERATION' }
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

let currentFlowId: string | null = null;

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
    case 'GENERATE_RESPONSE_STREAM': {
      if (action.payload.flowId !== currentFlowId) {
        return state;
      }
      return { ...state, response: state.response + action.payload.text };
    }
    case 'GENERATE_SINGLE_RESPONSE_SUCCESS': {
      const newInteraction: Interaction = {
        id: new Date().toISOString(),
        model: action.payload.model,
        prompt: action.payload.prompt,
        response: action.payload.response,
        summary: action.payload.summary,
      };
      // Only update if the response wasn't streamed
      const responseToSet = state.isGeneratingResponse ? state.response : action.payload.response;
      return {
        ...state,
        isGeneratingResponse: false,
        response: responseToSet,
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
    case 'STOP_GENERATION':
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
  const isMobile = useIsMobile();

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

  const getApiKeys = () => {
    if (typeof window === 'undefined') return {};
    const savedKeys = localStorage.getItem('model-api-keys');
    return savedKeys ? JSON.parse(savedKeys) : {};
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
    
    const apiKeys = getApiKeys();
    currentFlowId = new Date().toISOString(); // Unique ID for this generation flow

    dispatch({ type: 'GENERATE_RESPONSE_START', payload: data.prompt });
    
    try {
        if (state.selectedModel.id === ALL_MODELS_ID) {
            const results = await processPromptAll(data.prompt, apiKeys);
            const hydratedResults: IndividualResponse[] = results.map(res => ({
              ...res,
              model: MODELS.find(m => m.id === res.model.id)!,
            }));
            dispatch({
                type: 'GENERATE_ALL_RESPONSES_SUCCESS',
                payload: { responses: hydratedResults, prompt: data.prompt }
            })
        } else {
            const result = await processPromptStream({
                prompt: data.prompt, 
                modelName: state.selectedModel.name, 
                apiKeys,
                flowId: currentFlowId,
              }, 
              (chunk) => {
                dispatch({ type: 'GENERATE_RESPONSE_STREAM', payload: { text: chunk, flowId: currentFlowId! } });
              }
            );

            if (result) {
                dispatch({ 
                    type: 'GENERATE_SINGLE_RESPONSE_SUCCESS', 
                    payload: { ...result, prompt: data.prompt, model: state.selectedModel } 
                });
            }
        }
    } catch (error) {
      console.error("Failed to get response from model(s):", error);
      dispatch({ type: 'GENERATE_RESPONSE_ERROR' });
    }
  };

  const handleRegenerate = () => {
    if (state.prompt) {
        handlePromptSubmit({ prompt: state.prompt });
    }
  }

  const handleStopGeneration = () => {
    if (currentFlowId) {
        stopGenerationAction(currentFlowId);
        currentFlowId = null;
        dispatch({ type: 'STOP_GENERATION' });
    }
  }
  
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
    <SidebarProvider defaultOpen={!isMobile}>
       <div className="flex min-h-screen bg-background">
        <Sidebar collapsible={isMobile ? 'none' : 'icon'}>
          <SidebarContent 
            onNewChat={handleNewChat}
            interactions={state.history}
            onSelectInteraction={handleHistorySelect}
            activeInteractionId={state.activeInteractionId}
          />
        </Sidebar>
        <div className={cn("hidden md:flex flex-col w-80 border-r border-border bg-sidebar", isMobile && "hidden")}>
          <HistoryPanel
              interactions={state.history}
              onSelectInteraction={handleHistorySelect}
              activeInteractionId={state.activeInteractionId}
          />
        </div>
        <SidebarInset>
          <main className="flex-1 flex flex-col overflow-auto p-2 sm:p-4 md:p-6">
            <div className="mx-auto max-w-4xl 2xl:max-w-6xl w-full h-full">
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
              <div className="mx-auto max-w-4xl 2xl:max-w-6xl">
                {state.isGeneratingResponse ? (
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={handleStopGeneration} className="rounded-full">
                            <Square className="mr-2 h-4 w-4" /> Stop generating
                        </Button>
                    </div>
                ) : (state.prompt && (
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={handleRegenerate} className="rounded-full">
                            <RefreshCcw className="mr-2 h-4 w-4" /> Regenerate response
                        </Button>
                    </div>
                ))}
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

    