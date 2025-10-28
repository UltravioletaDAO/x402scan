import { Chain as FacilitatorsChain } from '../../../facilitators/types';
import { FACILITATORS as RAW_FACILITATORS } from '../../../facilitators/config';
import { Chain } from '@/types/chain';
import type { MixedAddress } from '@/types/address';
import { mixedAddressSchema } from './schemas';

export type Facilitator = {
  id: string;
  name: string;
  image: string;
  link: string;
  addresses: Partial<Record<Chain, MixedAddress[]>>;
  color: string;
};

const chainMap: Record<FacilitatorsChain, Chain> = {
  [FacilitatorsChain.BASE]: Chain.BASE,
  [FacilitatorsChain.POLYGON]: Chain.POLYGON,
  [FacilitatorsChain.SOLANA]: Chain.SOLANA,
  [FacilitatorsChain.AVALANCHE]: Chain.AVALANCHE,
};

export const facilitators: Facilitator[] = RAW_FACILITATORS.map(f => ({
  id: f.id,
  name: f.name,
  image: f.image,
  link: f.link,
  color: f.color,
  addresses: Object.entries(f.addresses).reduce(
    (acc, [chain, configs]) => {
      const scanChain = chainMap[chain as FacilitatorsChain];
      acc[scanChain] = configs.map(c => c.address as MixedAddress);
      return acc;
    },
    {} as Partial<Record<Chain, MixedAddress[]>>
  ),
}));

type FacilitatorId = (typeof facilitators)[number]['id'];

export const facilitatorIdMap = new Map<FacilitatorId, Facilitator>(
  facilitators.map(f => [f.id, f])
);

export const facilitatorAddresses = facilitators.flatMap(f =>
  Object.values(f.addresses)
    .flat()
    .map(address => mixedAddressSchema.parse(address))
);
