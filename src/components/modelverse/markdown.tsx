import React from 'react';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-foreground">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const lang = part.match(/```(\w*)\n/)?.[1] || '';
          const code = part.replace(/```\w*\n/, '').replace(/```$/, '');
          return (
            <div key={index} className="relative rounded-lg border bg-secondary/30">
              <div className="absolute top-2 right-2 text-xs text-muted-foreground">{lang}</div>
              <pre className="p-4 overflow-x-auto rounded-lg">
                <code className="font-code text-sm">{code}</code>
              </pre>
            </div>
          );
        }
        
        // Split text by newlines and wrap each line in a paragraph
        return part.split('\n').map((line, lineIndex) => {
          if (line.trim() === '') return null;
          // Render bold and italic text
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
