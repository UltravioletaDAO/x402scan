import type { AreaProps } from "recharts";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays } from "date-fns";
import { useMemo } from "react";
import type { TooltipRowProps } from "./tooltip";
import { TooltipContent } from "./tooltip";

export type ChartData<T extends Record<string, number>> = {
  timestamp: string;
} & T;

export interface ChartProps<T extends Record<string, number>> {
  data: ChartData<T>[];
  areas: Array<
    AreaProps & {
      dataKey: keyof T;
      color: string;
    }
  >;
  children?: React.ReactNode;
  tooltipRows?: Array<TooltipRowProps<T>>;
  height?: number | string;
}

export const BaseAreaChart = <
  T extends Omit<Record<string, number>, "timestamp">
>({
  data,
  children,
  tooltipRows,
  areas,
  height = 350,
}: ChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          {areas.map(({ dataKey, color }) => (
            <linearGradient
              key={dataKey as string}
              id={`${dataKey as string}-gradient`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <XAxis
          tickLine={false}
          tick={false}
          axisLine={false}
          interval="preserveEnd"
          height={0}
        />
        <YAxis domain={["0", "dataMax"]} hide={true} />
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {areas.map(({ dataKey, color, ref, ...areaProps }, index) => {
          return (
            <Area
              key={dataKey as string}
              isAnimationActive={index === areas.length - 1}
              dataKey={dataKey as string}
              stackId="1"
              fill={`color-mix(in oklab, ${color} 40%, transparent)`}
              stroke={color}
              type="monotone"
              {...areaProps}
            />
          );
        })}
        {children}
        {tooltipRows && (
          <Tooltip
            content={({ payload }) => {
              if (payload?.length) {
                return (
                  <TooltipContent
                    data={payload[0].payload as ChartData<T>}
                    rows={tooltipRows}
                  />
                );
              }
              return null;
            }}
            cursor={{
              fill: "var(--color-neutral-500)",
              opacity: 0.5,
              radius: 4,
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const simulateChartData = () => {
  const data: ChartData<{ value: number }>[] = [];
  const baseValue = 10;
  const variance = 20;
  let currentValue = baseValue;

  for (let i = 48; i >= 0; i--) {
    const date = subDays(new Date(), i);
    // Increment can be positive or negative, with some random variation
    const increment = (Math.random() - 0.5) * 2 * variance; // Range: -variance to +variance
    if (i !== 48) {
      currentValue += increment;
    }
    data.push({
      timestamp: format(date, "MMM dd"),
      value: Math.max(0, Math.round(currentValue)),
    });
  }

  return data;
};

export const LoadingChart = ({
  height = 350,
}: {
  height?: number | string;
}) => {
  const simulatedData = useMemo(simulateChartData, []);

  return (
    <div className="animate-pulse">
      <BaseAreaChart
        data={simulatedData}
        areas={[
          {
            dataKey: "value",
            color:
              "color-mix(in oklab, var(--color-neutral-500) 20%, transparent)",
            isAnimationActive: false,
          },
        ]}
        height={height}
      />
    </div>
  );
};
