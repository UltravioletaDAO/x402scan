import { CommandItem as BaseCommandItem } from '@/components/ui/command';

import { cn } from '@/lib/utils';
import { Favicon } from '@/components/favicon';
import { formatTokenAmount } from '@/lib/token';

interface Props {
  tool: string;
  isSelected: boolean;
  favicon: string | null;
  resource: string;
  price: bigint;
  description: string;
  addTool: (tool: string) => void;
  removeTool: (id: string) => void;
}

export const ToolItem: React.FC<Props> = ({
  tool,
  isSelected,
  favicon,
  resource,
  price,
  description,
  addTool,
  removeTool,
}) => {
  return (
    <BaseCommandItem
      onSelect={() => (isSelected ? removeTool(tool) : addTool(tool))}
      className="flex items-center justify-between gap-2 rounded-none px-3"
      value={tool}
    >
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        <div
          className={cn(
            'rounded-md overflow-hidden border relative shrink-0 size-6',
            isSelected && 'border-primary text-primary'
          )}
        >
          <Favicon url={favicon} className="size-full" />
        </div>

        <div className="flex flex-1 flex-col items-start gap-0 overflow-hidden">
          <h3 className="text-sm font-medium line-clamp-1 w-full max-w-full truncate">
            {resource}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
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
