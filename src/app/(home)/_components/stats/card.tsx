import { Card } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
}

export const OverallStatsCard: React.FC<Props> = ({ title, value }) => {
  return (
    <Card className="p-4">
      <h2 className="text-muted-foreground">{title}</h2>
      <h1 className="text-3xl font-bold">{value}</h1>
    </Card>
  );
};
