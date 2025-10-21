import { Globe } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';

interface Props {
  url: string | null;
  className?: string;
  Fallback?: LucideIcon;
}

export const Favicon = ({
  url,
  className = 'size-6',
  Fallback = Globe,
}: Props) => {
  if (!url) return <Fallback className={className} />;

  return (
    <Avatar
      src={url}
      className={className}
      fallback={<Fallback className={className} />}
    />
  );
};

interface FaviconsProps {
  favicons: (string | null)[];
  orientation?: 'horizontal' | 'vertical';
  containerClassName?: string;
  iconContainerClassName?: string;
}

export const Favicons: React.FC<FaviconsProps> = ({
  favicons,
  orientation = 'horizontal',
  containerClassName,
  iconContainerClassName,
}) => {
  if (favicons.length === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center',
        {
          'flex-col pt-2': orientation === 'vertical',
          'flex-row pl-2': orientation === 'horizontal',
        },
        containerClassName
      )}
    >
      {favicons.map((favicon, index) => {
        return (
          <div
            className={cn(
              'border bg-card rounded-full overflow-hidden',
              iconContainerClassName,
              {
                '-mt-2': orientation === 'vertical',
                '-ml-2': orientation === 'horizontal',
              }
            )}
            key={`${favicon}-${index}`}
          >
            <Favicon url={favicon} className="size-full" />
          </div>
        );
      })}
    </div>
  );
};

export const LoadingFavicons = ({
  count,
  orientation = 'horizontal',
  containerClassName,
  iconContainerClassName,
}: {
  count: number;
  orientation?: 'horizontal' | 'vertical';
  containerClassName?: string;
  iconContainerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center',
        {
          'flex-col pt-2': orientation === 'vertical',
          'flex-row pl-2': orientation === 'horizontal',
        },
        containerClassName
      )}
    >
      {Array.from({ length: count }).map((_, index) => {
        return (
          <Skeleton
            key={index}
            className={cn(iconContainerClassName, {
              '-mt-2': orientation === 'vertical',
              '-ml-2': orientation === 'horizontal',
            })}
          />
        );
      })}
    </div>
  );
};
