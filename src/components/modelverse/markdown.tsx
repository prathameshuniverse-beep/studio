
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  const { toast } = useToast();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({ title: "Copied to clipboard!" });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({ variant: "destructive", title: "Failed to copy" });
    });
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-foreground">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const lang = part.match(/```(\w*)\n/)?.[1] || '';
          const code = part.replace(/```\w*\n/, '').replace(/```$/, '');
          const [isCopied, setIsCopied] = useState(false);

          const onCopyClick = () => {
            handleCopy(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }

          return (
            <div key={index} className="relative rounded-lg border bg-secondary/30 group">
              <div className="flex items-center justify-between p-2">
                <span className="text-xs text-muted-foreground pl-2">{lang}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onCopyClick}>
                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
              <pre className="p-4 pt-0 overflow-x-auto rounded-b-lg">
                <code className="font-code text-sm">{code}</code>
              </pre>
            </div>
          );
        }
        
        return part.split('\n').map((line, lineIndex) => {
          if (line.trim() === '') return null;
          const formatText = (text: string) => {
             return text
                .split(/(\*\*.+?\*\*|\*.+?\*)/g)
                .map((segment, i) => {
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                        return <strong key={i}>{segment.slice(2, -2)}</strong>;
                    }
                    if (segment.startsWith('*') && segment.endsWith('*')) {
                        return <em key={i}>{segment.slice(1, -1)}</em>;
                    }
                    return segment;
                });
          }
          if (line.startsWith('- ')) {
            return <li key={`${index}-${lineIndex}`} className="ml-4 list-disc">{formatText(line.substring(2))}</li>
          }
          return <p key={`${index}-${lineIndex}`}>{formatText(line)}</p>;
        });
      })}
    </div>
  );
}

    