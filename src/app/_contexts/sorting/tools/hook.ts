import { ToolsSortingContext } from './context';

import { useSorting } from '../base/hook';

export const useSellersSorting = () => {
  const context = useSorting(ToolsSortingContext);
  if (!context) {
    throw new Error(
      'useSellersSorting must be used within a SellersSortingProvider'
    );
  }
  return context;
};
