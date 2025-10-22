import { Chain } from '@/types/chain';

import type { MixedAddress, SolanaAddress } from '@/types/address';

export type Facilitator = {
  id: string;
  name: string;
  image: string;
  link: string;
  addresses: MixedAddress[];
  color: string;
  chain: Chain;
};

const coinbaseFacilitator = {
  id: 'coinbase',
  name: 'Coinbase' as const,
  image: '/coinbase.png',
  link: 'https://docs.cdp.coinbase.com/x402/welcome',
  addresses: ['0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6'],
  color: 'var(--color-primary)',
  chain: Chain.BASE,
} satisfies Facilitator;

const x402rsFacilitator = {
  id: 'x402rs',
  name: 'X402rs' as const,
  image: '/x402rs.png',
  link: 'https://x402.rs',
  addresses: ['0xd8dfc729cbd05381647eb5540d756f4f8ad63eec'],
  color: 'var(--color-orange-600)',
  chain: Chain.BASE,
} satisfies Facilitator;

const payAiFacilitator = {
  id: 'payai',
  name: 'PayAI' as const,
  image: '/payai.png',
  link: 'https://payai.network',
  addresses: ['0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63'],
  color: 'var(--color-purple-600)',
  chain: Chain.BASE,
} satisfies Facilitator;

const aurraCloudFacilitator = {
  id: 'aurracloud',
  name: 'AurraCloud' as const,
  image: '/aurracloud.png',
  link: 'https://x402-facilitator.aurracloud.com',
  addresses: ['0x222c4367a2950f3b53af260e111fc3060b0983ff'],
  color: 'var(--color-yellow-600)',
  chain: Chain.BASE,
} satisfies Facilitator;

const thirdwebFacilitator = {
  id: 'thirdweb',
  name: 'thirdweb' as const,
  image: '/thirdweb.png',
  link: 'https://portal.thirdweb.com/payments/x402/facilitator',
  addresses: ['0x80c08de1a05df2bd633cf520754e40fde3c794d3'],
  color: 'var(--color-pink-600)',
  chain: Chain.BASE,
} satisfies Facilitator;

const payAiSolanaFacilitator = {
  id: 'payai-solana',
  name: 'PayAI Solana' as const,
  image: '/payai.png',
  link: 'https://payai.network',
  addresses: [
    '2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4',
  ] as SolanaAddress[],
  color: 'var(--color-purple-600)',
  chain: Chain.SOLANA,
} satisfies Facilitator;

export const facilitators = [
  coinbaseFacilitator,
  x402rsFacilitator,
  payAiFacilitator,
  aurraCloudFacilitator,
  thirdwebFacilitator,
  payAiSolanaFacilitator,
] satisfies Facilitator[];

type FacilitatorId = (typeof facilitators)[number]['id'];
export type FacilitatorName = (typeof facilitators)[number]['name'];
export type FacilitatorAddress =
  (typeof facilitators)[number]['addresses'][number];

export const facilitatorNameMap = new Map<FacilitatorName, Facilitator>(
  facilitators.map(f => [f.name, f])
);

export const facilitatorIdMap = new Map<FacilitatorId, Facilitator>(
  facilitators.map(f => [f.id, f])
);

export const facilitatorAddressMap = new Map<FacilitatorAddress, Facilitator>(
  facilitators.flatMap(f => f.addresses.map(a => [a, f]))
);
