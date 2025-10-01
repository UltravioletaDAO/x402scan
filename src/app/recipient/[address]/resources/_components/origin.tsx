import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Favicon } from '@/components/favicon';

import { cn } from '@/lib/utils';

import type { OgImage, ResourceOrigin } from '@prisma/client';

interface Props {
  origin: ResourceOrigin & {
    ogImages: OgImage[];
  };
}

export const OriginCard: React.FC<Props> = ({ origin }) => {
  const hasMetadata =
    origin.title !== null ||
    origin.description !== null ||
    origin.ogImages.length > 0;

  return (
    <Card className="overflow-hidden flex">
      <div className="flex-1">
        <CardHeader
          className={cn(
            'space-y-0 flex flex-row items-center gap-2 bg-muted',
            hasMetadata && 'border-b'
          )}
        >
          <Favicon url={origin.favicon} className="size-6" />
          <CardTitle className="font-bold text-lg">
            {new URL(origin.origin).hostname}
          </CardTitle>
        </CardHeader>
        {hasMetadata && (
          <CardContent className="flex flex-row items-start justify-between gap-2 pt-4">
            <div className="flex flex-col gap-2">
              <div>
                <h3
                  className={cn('font-medium', !origin.title && 'opacity-60')}
                >
                  {origin.title ?? 'No Title'}
                </h3>
                <p
                  className={cn(
                    'text-sm text-muted-foreground',
                    !origin.description && 'text-muted-foreground/60'
                  )}
                >
                  {origin.description ?? 'No Description'}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </div>
      {origin.ogImages.length > 0 && (
        <div className="h-36 border-l flex items-center justify-center bg-muted p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={origin.ogImages[0].url}
            alt={origin.ogImages[0].title ?? ''}
            className="h-full rounded-md"
          />
        </div>
      )}
    </Card>
  );
};
