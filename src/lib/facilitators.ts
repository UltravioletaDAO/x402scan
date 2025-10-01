import type { Facilitator } from '@/types/facilitator';

export const coinbaseFacilitator1: Facilitator = {
  address: '0xd8dfc729cbd05381647eb5540d756f4f8ad63eec',
  name: 'Coinbase Facilitator',
  image: '/coinbase.png',
};

export const coinbaseFacilitator2: Facilitator = {
  address: '0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6',
  name: 'Coinbase Facilitator',
  image: '/coinbase.png',
};

const facilitators = [coinbaseFacilitator1, coinbaseFacilitator2];

export const facilitatorMap = new Map(facilitators.map(f => [f.address, f]));
