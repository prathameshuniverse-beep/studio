import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { BrainCircuitIcon } from '@/components/icons';

export default function Loading() {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex h-full flex-col p-2 gap-4">
          <div className="flex items-center gap-2 p-2">
            <BrainCircuitIcon className="w-8 h-8 text-primary" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-4 p-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4 p-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-4 p-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-6 w-32" />
            <div className="w-7"></div>
          </div>
        </SidebarHeader>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl h-full flex flex-col items-center justify-center gap-4">
            <BrainCircuitIcon className="w-16 h-16 text-muted-foreground animate-pulse" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </main>

        <footer className="p-4 md:p-6 border-t">
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="absolute right-3 bottom-3 h-8 w-20" />
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
