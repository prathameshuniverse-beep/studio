"use client";

import React from 'react';
import {
  SidebarHeader,
  SidebarContent as SidebarContentArea,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BrainCircuitIcon } from '@/components/icons';
import { SettingsDialog } from './settings-dialog';
import { Cog, History, LayoutGrid, Pencil, Palette, Sun, Moon, Sparkles, Paintbrush } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HistoryPanel } from './history-panel';
import type { Interaction } from '@/lib/types';
import { useTheme } from '@/components/theme-provider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


type SidebarContentProps = {
  onNewChat: () => void;
  interactions: Interaction[];
  onSelectInteraction: (id: string) => void;
  activeInteractionId: string | null;
};

export function SidebarContent({
  onNewChat,
  interactions,
  onSelectInteraction,
  activeInteractionId,
}: SidebarContentProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState('explore');
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = React.useState(false);
  const { setTheme } = useTheme();


  const handleMenuClick = (buttonName: string) => {
    if (buttonName === 'new') {
        onNewChat();
        setActiveButton('explore'); 
    } else if (buttonName !== 'history') {
        setActiveButton(buttonName);
    }
  };

  const handleHistorySelect = (id: string) => {
    onSelectInteraction(id);
    setIsHistoryPanelOpen(false);
  }

  return (
    <>
      <SidebarHeader className="p-0">
        <div className="flex items-center justify-center h-14">
          <BrainCircuitIcon className="w-8 h-8 text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContentArea className="flex-1 p-0">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Explore" size="lg" isActive={activeButton === 'explore'} onClick={() => handleMenuClick('explore')}>
                    <LayoutGrid />
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="New Chat" size="lg" onClick={() => handleMenuClick('new')}>
                    <Pencil />
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Sheet open={isHistoryPanelOpen} onOpenChange={setIsHistoryPanelOpen}>
                    <SheetTrigger asChild>
                        <SidebarMenuButton tooltip="History" size="lg" isActive={activeButton === 'history'}>
                            <History />
                        </SidebarMenuButton>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80">
                         <HistoryPanel
                            interactions={interactions}
                            onSelectInteraction={handleHistorySelect}
                            activeInteractionId={activeInteractionId}
                        />
                    </SheetContent>
                </Sheet>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContentArea>
      <SidebarFooter className="p-0">
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton tooltip="Change Theme" size="lg">
                            <Palette />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="center" className="mb-2">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setTheme("vibrant")}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Vibrant</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("colorful")}>
                            <Paintbrush className="mr-2 h-4 w-4" />
                            <span>Colorful</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" size="lg" onClick={() => setIsSettingsOpen(true)}>
                    <Cog />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
