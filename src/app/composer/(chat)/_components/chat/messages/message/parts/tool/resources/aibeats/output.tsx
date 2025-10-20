import type { JsonValue } from '@/components/ai-elements/json-viewer';
import { JsonViewer } from '@/components/ai-elements/json-viewer';
import type { OutputComponent } from '../types';

import z from 'zod';

const aibeatsOutputSchema = z.object({
  success: z.literal(true),
  result: z.object({
    audioUrl: z.string(),
    fileName: z.string(),
    finalLyrics: z.string(),
    aiTitle: z.string(),
    artwork: z.string().nullable(),
    metadata: z.object({
      originalPrompt: z.string(),
      enhancedPrompt: z.string(),
      duration: z.number(),
      fileSize: z.number(),
      format: z.string(),
      sampleRate: z.number(),
      bitrate: z.number(),
    }),
  }),
  usage: z.object({
    totalCost: z.number(),
    paymentMethod: z.string(),
    remainingCredits: z.number(),
  }),
});

export const AibeatsOutput: OutputComponent = ({ output, errorText }) => {
  if (errorText) {
    return <div className="text-destructive text-sm">{errorText}</div>;
  }

  const parseResult = aibeatsOutputSchema.safeParse(output);

  if (!parseResult.success) {
    return <JsonViewer data={JSON.parse(output as string) as JsonValue} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {parseResult.data.result.finalLyrics}
    </div>
  );
};
