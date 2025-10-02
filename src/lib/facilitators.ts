// import { z } from 'zod';

// import { ethereumAddressSchema } from './schemas';

// const facilitatorSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   image: z.string(),
//   link: z.url(),
//   addresses: z.array(ethereumAddressSchema),
// });

export type Facilitator = {
  id: string;
  name: string;
  image: string;
  link: string;
  addresses: string[];
};

const coinbaseFacilitator: Facilitator = {
  id: 'coinbase',
  name: 'Coinbase',
  image: '/coinbase.png',
  link: 'https://coinbase.com',
  addresses: ['0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'],
};

const x402rsFacilitator: Facilitator = {
  id: 'x402rs',
  name: 'X402rs',
  image: '/x402rs.png',
  link: 'https://x402rs.com',
  addresses: ['0xd8dfc729cbd05381647eb5540d756f4f8ad63eec'],
};

const payAiFacilitator: Facilitator = {
  id: 'payai',
  name: 'PayAI',
  image: '/payai.png',
  link: 'https://payai.com',
  addresses: ['0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63'],
};

export const facilitators = [
  coinbaseFacilitator,
  x402rsFacilitator,
  payAiFacilitator,
];

export const facilitatorIdMap = new Map(facilitators.map(f => [f.id, f]));

export const facilitatorAddressMap = new Map(
  facilitators.flatMap(f => f.addresses.map(a => [a, f]))
);
