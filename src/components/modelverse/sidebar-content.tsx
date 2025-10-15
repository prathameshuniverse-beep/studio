"use client";

import React from 'react';
import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BrainCircuitIcon } from '@/components/icons';
import { MODELS } from '@/lib/constants';
import type { Model } from '@/lib/types';
import { SettingsDialog } from './settings-dialog';
import { Cog } from 'lucide-react';

type SidebarContentProps = {
  selectedModel: Model | null;
  onModelSelect: (modelId: string) => void;
  temperature: number;
  onTemperatureChange: (value: number[]) => void;
  maxTokens: number;
  onMaxTokensChange: (value: number[]) => void;
};

export function SidebarContent({
  selectedModel,
  onModelSelect,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
}: SidebarContentProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-semibold">ModelVerse</h2>
        </div>
      </SidebarHeader>
      <SidebarContentArea className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Model</SidebarGroupLabel>
          <Select
            value={selectedModel?.id}
            onValueChange={onModelSelect}
          >
            <SelectTrigger className="w-full">
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
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {temperature}</Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={onTemperatureChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
              <Slider
                id="max-tokens"
                min={256}
                max={4096}
                step={256}
                value={[maxTokens]}
                onValueChange={onMaxTokensChange}
              />
            </div>
          </div>
        </SidebarGroup>
      </SidebarContentArea>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsSettingsOpen(true)}>
            <Cog className="w-4 h-4" />
            <span>Settings</span>
        </Button>
      </SidebarFooter>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
