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
import { Cog, History, LayoutGrid, Pencil } from 'lucide-react';

type SidebarContentProps = {
  onNewChat: () => void;
};

export function SidebarContent({
  onNewChat,
}: SidebarContentProps) {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState('history');

  const handleMenuClick = (buttonName: string) => {
    if (buttonName === 'new') {
        onNewChat();
        setActiveButton('history'); // Or whatever the default should be
    } else {
        setActiveButton(buttonName);
    }
  };

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
                <SidebarMenuButton tooltip="History" size="lg" isActive={activeButton === 'history'} onClick={() => handleMenuClick('history')}>
                    <History />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContentArea>
      <SidebarFooter className="p-0">
        <SidebarMenu>
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
