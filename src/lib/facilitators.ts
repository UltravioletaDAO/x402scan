import { z } from 'zod';

import { ethereumAddressSchema } from './schemas';

export const facilitatorSchema = z.object({
  name: z.string(),
  image: z.string(),
  addresses: z.array(ethereumAddressSchema),
});

export type Facilitator = z.infer<typeof facilitatorSchema>;

export const coinbaseFacilitator: Facilitator = {
  name: 'Coinbase',
  image: '/coinbase.png',
  addresses: ['0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'],
};

export const x402rsFacilitator: Facilitator = {
  name: 'X402rs',
  image: '/x402rs.png',
  addresses: ['0xd8dfc729cbd05381647eb5540d756f4f8ad63eec'],
};

export const payAiFacilitator: Facilitator = {
  name: 'PayAI',
  image: '/payai.png',
  addresses: ['0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63'],
};

export const facilitators = [
  coinbaseFacilitator,
  x402rsFacilitator,
  payAiFacilitator,
];

export const facilitatorMap = new Map(
  facilitators.flatMap(f => f.addresses.map(a => [a, f]))
);
