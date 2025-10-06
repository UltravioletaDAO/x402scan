import { USDC_ADDRESS } from '@/lib/utils';
import { useBalance as useBalanceWagmi } from 'wagmi';
import { base } from 'viem/chains';
import { useCurrentUser } from '@coinbase/cdp-hooks';

export const useBalance = () => {
  const { currentUser } = useCurrentUser();

  const result = useBalanceWagmi({
    address: currentUser?.evmAccounts?.[0] ?? undefined,
    token: USDC_ADDRESS,
    chainId: base.id,
  });

  return {
    ...result,
    data: result.data
      ? Number(result.data.value) / 10 ** result.data.decimals
      : undefined,
  };
};
