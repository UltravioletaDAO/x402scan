import type { JsonValue } from '@/components/ai-elements/json-viewer';
import { JsonViewer } from '@/components/ai-elements/json-viewer';
import type { OutputComponent } from '../../types';

import z from 'zod';
import { api } from '@/trpc/client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const createSoraVideoOutputSchema = z.object({
  id: z.string(),
  object: z.literal('video'),
  created_at: z.number().int(),
  status: z.string(),
  completed_at: z.number().int().nullable(),
  error: z.record(z.string(), z.any()).nullable(),
  expires_at: z.number().int().nullable(),
  model: z.string(),
  progress: z.number().int(),
  remixed_from_video_id: z.string().nullable(),
  seconds: z.string(),
  size: z.string(),
});

export const SoraOutput: OutputComponent = ({ output, errorText }) => {
  if (errorText) {
    return <div className="text-destructive text-sm">{errorText}</div>;
  }

  const parseResult = createSoraVideoOutputSchema.safeParse(output);

  if (!parseResult.success) {
    try {
      const data = JSON.parse(output as string) as JsonValue;
      return <JsonViewer data={data} />;
    } catch {
      return <div className="text-destructive text-sm">Invalid output</div>;
    }
  }

  const { id } = parseResult.data;

  return <SoraVideoDisplay id={id} />;
};

const SoraVideoDisplay: React.FC<{ id: string }> = ({ id }) => {
  const [isTaskFetched, setIsTaskFetched] = useState(false);

  const {
    data: task,
    isLoading: isTaskLoading,
    error: taskError,
  } = api.user.tools.echo.sora.getVideo.useQuery(id, {
    refetchInterval: isTaskFetched ? undefined : 2000,
  });

  useEffect(() => {
    if (task && task.status === 'completed') {
      setIsTaskFetched(true);
    }
  }, [task, id]);

  if (taskError) {
    return <div className="text-destructive text-sm">{taskError.message}</div>;
  }

  if (isTaskLoading || task?.status === 'in_progress') {
    return <Skeleton className="size-48" />;
  }

  return (
    <div className="max-h-48">
      <video
        src={`https://echo.router.merit.systems/v1/videos/${id}/content`}
        controls
        className="max-h-48 w-auto rounded-md"
      />
    </div>
  );
};
