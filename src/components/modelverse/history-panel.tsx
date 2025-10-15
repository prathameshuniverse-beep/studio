
"use client"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Interaction, IndividualResponse } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import * as React from "react"

interface HistoryPanelProps {
  interactions: Interaction[]
  onSelectInteraction: (id: string) => void
  activeInteractionId: string | null
}

function getResponseText(response: string | IndividualResponse[]): string {
    if (typeof response === 'string') {
      return response;
    }
    if (Array.isArray(response)) {
      return response.map(r => r.response).join(' ');
    }
    return '';
}

export function HistoryPanel({
  interactions,
  onSelectInteraction,
  activeInteractionId,
}: HistoryPanelProps) {
  const [search, setSearch] = React.useState("")

  const filteredInteractions = interactions.filter(
    (interaction) =>
      interaction.prompt.toLowerCase().includes(search.toLowerCase()) ||
      getResponseText(interaction.response).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col w-full h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-semibold">History</h2>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            className="pl-9 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {interactions.length === 0 && search === "" && (
             <div className="text-center text-sm text-muted-foreground py-8">
                No history yet. Start a new chat!
             </div>
          )}
          {filteredInteractions.length === 0 && search !== "" && (
             <div className="text-center text-sm text-muted-foreground py-8">
                No results found.
             </div>
          )}
          {filteredInteractions.map((interaction) => (
            <button
              key={interaction.id}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                activeInteractionId === interaction.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => onSelectInteraction(interaction.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <interaction.model.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">
                    {interaction.prompt}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {interaction.summary}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

    