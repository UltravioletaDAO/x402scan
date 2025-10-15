import { CommandItem as BaseCommandItem } from '@/components/ui/command';

import { Favicon } from '@/components/favicon';

import { cn } from '@/lib/utils';
import { formatTokenAmount } from '@/lib/token';

import type { RouterOutputs } from '@/trpc/client';

interface Props {
  isSelected: boolean;
  resource: RouterOutputs['availableTools']['list'][number];
  onSelectResource: (resourceId: string) => void;
}

export const ResourceItem: React.FC<Props> = ({
  resource,
  isSelected,
  onSelectResource,
}) => {
  return (
    <BaseCommandItem
      onSelect={() => onSelectResource(resource.id)}
      className="flex items-center justify-between gap-2 rounded-none px-3"
      value={resource.resource}
    >
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        <div
          className={cn('rounded-md overflow-hidden relative shrink-0 size-6')}
        >
          <Favicon url={resource.origin.favicon} className="size-full" />
        </div>

        <div className="flex flex-1 flex-col items-start gap-0 overflow-hidden">
          <h3
            className={cn(
              'text-sm font-semibold line-clamp-1 w-full max-w-full truncate',
              isSelected && 'text-primary'
            )}
          >
            {resource.resource}
          </h3>
          <p className="text-[10px] text-muted-foreground line-clamp-2">
            {resource.description}
          </p>
        </div>
      </div>
      <p className="text-xs text-primary font-bold">
        {formatTokenAmount(BigInt(resource.maxAmountRequired))}
      </p>
    </BaseCommandItem>
  );
};
