export enum Chain {
  BASE = 'base',
  SOLANA = 'solana',
}

export const SUPPORTED_CHAINS = Object.values(Chain);

export const CHAIN_LABELS: Record<Chain, string> = {
  [Chain.BASE]: 'Base',
  [Chain.SOLANA]: 'Solana',
};

export const CHAIN_ICONS: Record<Chain, string> = {
  [Chain.BASE]: '/base.png',
  [Chain.SOLANA]: '/solana.png',
};

export const DEFAULT_CHAIN = Chain.BASE;
