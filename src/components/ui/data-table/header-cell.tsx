import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface Props {
  Icon: LucideIcon;
  label: string;
  className?: string;
}

export const HeaderCell: React.FC<Props> = ({ Icon, label, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 text-sm text-muted-foreground',
        className
      )}
    >
      <Icon className="size-3" />
      {label}
    </div>
  );
};
