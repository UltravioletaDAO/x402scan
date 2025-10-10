import { facilitator as baseFacilitator } from '@coinbase/x402';

import type { FacilitatorConfig } from 'x402/types';

const payAiFacilitator: FacilitatorConfig = {
  url: 'https://facilitator.payai.network',
};

export const facilitators: FacilitatorConfig[] = [
  baseFacilitator,
  payAiFacilitator,
];
