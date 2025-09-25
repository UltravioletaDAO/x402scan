import { ChartContainer } from "@/components/ui/chart";

import type { Value, StatChart } from "../types";

interface Props {
  values: Value[];
  Chart: StatChart;
  formatOptions?: BigIntToLocaleStringOptions;
}

export const StatChartContent: React.FC<Props> = ({
  values,
  Chart,
  formatOptions,
}) => {
  const format = (value: bigint) => {
    return value.toLocaleString(undefined, {
      notation: "compact",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      ...formatOptions,
    });
  };

  const displayValue = values.reduce((acc, curr) => acc + curr.value, 0n);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold px-4">{format(displayValue)}</h1>
      <ChartContainer className="h-48 w-full" config={{}}>
        <Chart values={values} format={format} />
      </ChartContainer>
    </div>
  );
};
