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

export type ChartData<T extends Record<string, number>> = {
  timestamp: string;
} & T;

export interface ChartProps<T extends Record<string, number>> {
  data: ChartData<T>[];
  children?: React.ReactNode;
  tooltipRows?: Array<TooltipRowProps<T>>;
  height?: number | string;
  margin?: { top: number; right: number; left: number; bottom: number };
}

export type Series<T extends Record<string, number>, S> = S & {
  dataKey: keyof T;
  color: string;
};
