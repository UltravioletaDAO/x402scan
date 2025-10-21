export enum Chain {
    BASE = 'base',
    SOLANA = 'solana',
}

export const SUPPORTED_CHAINS = [Chain.BASE, Chain.SOLANA];

export const CHAIN_LABELS: Record<Chain, string> = {
    [Chain.BASE]: 'Base',
    [Chain.SOLANA]: 'Solana',
}

export const CHAIN_ICONS: Record<Chain, string> = {
    [Chain.BASE]: '/base.png',
    [Chain.SOLANA]: '/solana.jpg',
}

export const DEFAULT_CHAIN = Chain.BASE;