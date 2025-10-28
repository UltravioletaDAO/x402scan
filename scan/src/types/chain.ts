export enum Chain {
  BASE = 'base',
  SOLANA = 'solana',
  POLYGON = 'polygon',
  OPTIMISM = 'optimism',
  AVALANCHE = 'avalanche',
}

export const SUPPORTED_CHAINS = Object.values([
  Chain.BASE,
  Chain.SOLANA,
  Chain.AVALANCHE,
]);

export const CHAIN_LABELS: Record<Chain, string> = {
  [Chain.BASE]: 'Base',
  [Chain.SOLANA]: 'Solana',
  [Chain.POLYGON]: 'Polygon',
  [Chain.OPTIMISM]: 'Optimism',
  [Chain.AVALANCHE]: 'Avalanche',
};

export const CHAIN_ICONS: Record<Chain, string> = {
  [Chain.BASE]: '/base.png',
  [Chain.SOLANA]: '/solana.png',
  [Chain.POLYGON]: '/polygon.png',
  [Chain.OPTIMISM]: '/optimism.png',
  [Chain.AVALANCHE]: '/avalanche.png',
};
