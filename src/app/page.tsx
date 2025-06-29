'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, FileCode, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getNormalizedCode } from './actions';

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const { toast } = useToast();

  const onCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to clipboard!',
      description: 'The normalized code has been copied.',
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onCopy}
      disabled={!textToCopy}
      aria-label="Copy code"
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

export default function Home() {
  const [originalCode, setOriginalCode] = useState('');
  const [normalizedCode, setNormalizedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNormalize = async () => {
    setIsLoading(true);
    setNormalizedCode('');

    const result = await getNormalizedCode(originalCode);

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.data) {
      setNormalizedCode(result.data.normalizedCode);
    }
    
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-4">
            <Wand2 className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">
              SourceNormalizer
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card className="flex flex-col shadow-lg">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Original Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex">
              <Textarea
                value={originalCode}
                onChange={(e) => setOriginalCode(e.target.value)}
                className="font-code text-sm flex-grow w-full min-h-[400px] lg:min-h-[500px] bg-muted/30 resize-none"
                placeholder=""
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Normalized Code
              </CardTitle>
              <CopyButton textToCopy={normalizedCode} />
            </CardHeader>
            <CardContent className="flex-grow flex">
              {isLoading ? (
                <div className="space-y-3 p-4 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <Textarea
                  readOnly
                  value={normalizedCode}
                  className="font-code text-sm flex-grow w-full min-h-[400px] lg:min-h-[500px] bg-muted/30 resize-none focus-visible:ring-0"
                  placeholder=""
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            onClick={handleNormalize}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Normalizing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" /> Normalize Code
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
