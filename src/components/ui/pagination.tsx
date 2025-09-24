import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";

interface Props {
  page: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const CursorPagePagination: React.FC<Props> = ({
  page,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        onClick={onPrevious}
        variant="outline"
        size="icon"
        disabled={!onPrevious}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <p>{page}</p>
      <Button onClick={onNext} disabled={!onNext} variant="outline" size="icon">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};
