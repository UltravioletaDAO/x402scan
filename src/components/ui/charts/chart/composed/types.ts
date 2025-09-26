import type { AreaProps, BarProps, LineProps } from "recharts";

import type { ChartProps } from "../types";

export interface ComposedChartProps<T extends Record<string, number>>
  extends ChartProps<T> {
  bars: Array<BarProps & { dataKey: keyof T; color: string }>;
  areas: Array<AreaProps & { dataKey: keyof T; color: string }>;
  lines: Array<LineProps & { dataKey: keyof T; color: string }>;
}
