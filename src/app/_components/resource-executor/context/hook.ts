import { useContext } from 'react';

import { ResourceExecutorContext } from './context';

export const useResourceExecutor = () => {
  const context = useContext(ResourceExecutorContext);
  if (!context) {
    throw new Error(
      'useResourceExecutor must be used within a ResourceExecutorProvider'
    );
  }
  return context;
};
