import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus, TestTubeDiagonal } from 'lucide-react';
import Link from 'next/link';

interface Props {
  hasOrigins: boolean;
  address: string;
}

export const HeaderButtons: React.FC<Props> = ({ hasOrigins, address }) => {
  return (
    <ButtonsContainer>
      {hasOrigins && (
        <Link href={`/recipient/${address}/resources`}>
          <Button variant="turbo">
            <TestTubeDiagonal className="size-4" />
            Try Resources
          </Button>
        </Link>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="cursor-not-allowed opacity-50">
            <Plus className="size-4" />
            Add Resources
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Coming Soon</TooltipContent>
      </Tooltip>
    </ButtonsContainer>
  );
};

export const LoadingHeaderButtons = () => {
  return (
    <ButtonsContainer>
      <Skeleton className="h-8 md:h-9 w-24" />
    </ButtonsContainer>
  );
};

const ButtonsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-row gap-2">{children}</div>;
};
