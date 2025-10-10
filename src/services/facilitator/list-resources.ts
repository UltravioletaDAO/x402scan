import 'server-only';

import type { FacilitatorConfig } from 'x402/types';
import { useFacilitator as facilitatorUtils } from 'x402/verify';

export const listFacilitatorResources = async (
  facilitator: FacilitatorConfig
) => {
  return await facilitatorUtils(facilitator).list();
};
