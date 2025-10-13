import { ecosystemItems } from './list';
import { defaultEcosystemItems } from './default';

export const useEcosystemItems = () => {
  // NOTE(shafu): ecosystemItems come from `x402.org/ecosystem`, while
  // defaultEcosystemItems are defined here in the repo.
  return [...ecosystemItems, ...defaultEcosystemItems];
};
