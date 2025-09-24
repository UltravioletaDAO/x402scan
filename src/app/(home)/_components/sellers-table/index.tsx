import { Suspense } from "react";

import { Sorting, SortingProvider } from "./sorting";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SellersTable: React.FC<Props> = ({
  title,
  description,
  children,
}) => {
  return (
    <SortingProvider>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Sorting />
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
    </SortingProvider>
  );
};
