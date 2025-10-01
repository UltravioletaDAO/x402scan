import { useContext } from 'react';

import { ResourceCheckContext } from './context';

export const useResourceCheck = () => {
  const context = useContext(ResourceCheckContext);
  if (!context) {
    throw new Error(
      'useResourceCheck must be used within a ResourceCheckProvider'
    );
  }
  return context;
};
