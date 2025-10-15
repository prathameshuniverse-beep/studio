"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Markdown } from './markdown';

interface ResponseDisplayProps {
  response: string;
  summary: string;
  isLoading: boolean;
}

export function ResponseDisplay({
  response,
  summary,
  isLoading,
}: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <Tabs defaultValue="response">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Model Response</CardTitle>
            <TabsList>
              <TabsTrigger value="response">Full Response</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="response">
            <Markdown content={response} />
          </TabsContent>
          <TabsContent value="summary">
            <p className="text-muted-foreground">{summary}</p>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
