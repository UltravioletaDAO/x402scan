import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Card } from "../card";

import type { ChartData } from "./bar-chart";

export interface TooltipRowProps<
  T extends Record<string, number>,
  K extends keyof T = keyof T
> {
  key: K;
  label: string;
  getValue: (data: T[K]) => string;
  labelClassName?: string;
  valueClassName?: string;
}

interface Props<T extends Record<string, number>> {
  data: ChartData<T>;
  rows: Array<TooltipRowProps<T>>;
}

export const TooltipContent = <T extends Record<string, number>>({
  data,
  rows,
}: Props<T>) => {
  return (
    <Card className="min-w-32 overflow-hidden">
      <TooltipDate date={new Date(data.timestamp)} />
      <Separator />
      {rows.map((row) => (
        <TooltipRow
          {...row}
          key={row.key as string}
          value={row.getValue(data[row.key])}
        />
      ))}
    </Card>
  );
};

const TooltipRow = <T extends Record<string, number>, K extends keyof T>({
  label,
  value,
  labelClassName,
  valueClassName,
}: TooltipRowProps<T, K> & {
  value: string;
}) => {
  return (
    <div className="flex justify-between w-full gap-4 p-2">
      <p className={cn("text-xs text-muted-foreground", labelClassName)}>
        {label}
      </p>
      <p
        className={cn(
          "text-xs text-muted-foreground font-medium",
          valueClassName
        )}
      >
        {value}
      </p>
    </div>
  );
};

const TooltipDate = ({ date }: { date: Date }) => {
  return (
    <div className="flex justify-between items-center w-full gap-4 bg-muted p-2">
      <p className="font-medium">{format(date, "MMMM d, yyyy")}</p>
    </div>
  );
};
