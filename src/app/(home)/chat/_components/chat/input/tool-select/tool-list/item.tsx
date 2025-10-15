import { CommandItem as BaseCommandItem } from '@/components/ui/command';

import { cn } from '@/lib/utils';
import { Favicon } from '@/components/favicon';
import { formatTokenAmount } from '@/lib/token';

interface Props {
  isSelected: boolean;
  favicon: string | null;
  resource: string;
  price: bigint;
  description: string;
  addTool: (resource: string) => void;
  removeTool: (resource: string) => void;
}

export const ToolItem: React.FC<Props> = ({
  resource,
  isSelected,
  favicon,
  price,
  description,
  addTool,
  removeTool,
}) => {
  return (
    <BaseCommandItem
      onSelect={() => (isSelected ? removeTool(resource) : addTool(resource))}
      className="flex items-center justify-between gap-2 rounded-none px-3"
      value={resource}
    >
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        <div
          className={cn('rounded-md overflow-hidden relative shrink-0 size-6')}
        >
          <Favicon url={favicon} className="size-full" />
        </div>

        <div className="flex flex-1 flex-col items-start gap-0 overflow-hidden">
          <h3
            className={cn(
              'text-sm font-semibold line-clamp-1 w-full max-w-full truncate',
              isSelected && 'text-primary'
            )}
          >
            {resource}
          </h3>
          <p className="text-[10px] text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
      <p className="text-xs text-primary font-bold">
        {formatTokenAmount(price)}
      </p>
    </BaseCommandItem>
  );
};
