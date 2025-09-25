export interface Value {
  value: bigint;
  date: Date;
}

interface StatChartProps {
  values: Value[];
  format: (value: bigint) => string;
}

export type StatChart = React.FC<StatChartProps>;
