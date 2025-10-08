import type { Address } from 'viem';

export type Facilitator = {
  id: string;
  name: string;
  image: string;
  link: string;
  addresses: Address[];
  color: string;
};

const coinbaseFacilitator = {
  id: 'coinbase',
  name: 'Coinbase' as const,
  image: '/coinbase.png',
  link: 'https://docs.cdp.coinbase.com/x402/welcome',
  addresses: ['0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'],
  color: 'var(--color-primary)',
} satisfies Facilitator;

const x402rsFacilitator = {
  id: 'x402rs',
  name: 'X402rs' as const,
  image: '/x402rs.png',
  link: 'https://x402.rs',
  addresses: ['0xd8dfc729cbd05381647eb5540d756f4f8ad63eec'],
  color: 'var(--color-red-500)',
} satisfies Facilitator;

const payAiFacilitator = {
  id: 'payai',
  name: 'PayAI' as const,
  image: '/payai.png',
  link: 'https://payai.network',
  addresses: ['0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63'],
  color: 'var(--color-green-500)',
} satisfies Facilitator;

export const facilitators = [
  coinbaseFacilitator,
  x402rsFacilitator,
  payAiFacilitator,
] satisfies Facilitator[];

export type FacilitatorName = (typeof facilitators)[number]['name'];

export const facilitatorIdMap = new Map(facilitators.map(f => [f.id, f]));

export const facilitatorAddressMap = new Map(
  facilitators.flatMap(f => f.addresses.map(a => [a, f]))
);
