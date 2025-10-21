import { facilitator as baseFacilitator } from '@coinbase/x402';

import type { FacilitatorConfig } from 'x402/types';

export type ExtendedFacilitatorConfig = FacilitatorConfig & {
  useListEndpoint?: boolean;
};

const payAiFacilitator: ExtendedFacilitatorConfig = {
  url: 'https://facilitator.payai.network',
};

const thirdwebFacilitator: ExtendedFacilitatorConfig = {
  url: 'https://api.thirdweb.com/v1/payments/x402',
};

const payAiSolanaFacilitator: ExtendedFacilitatorConfig = {
  url: 'https://facilitator.payai.network',
  useListEndpoint: true,
};

export const facilitators: FacilitatorConfig[] = [
  baseFacilitator,
  payAiFacilitator,
  thirdwebFacilitator,
  payAiSolanaFacilitator,
];
