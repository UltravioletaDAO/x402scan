import { useCurrentUser } from '@coinbase/cdp-hooks';
import { useBalance as useBalanceWagmi } from 'wagmi';
import { base } from 'viem/chains';

export const useEthBalance = () => {
  const { currentUser } = useCurrentUser();

  const result = useBalanceWagmi({
    address: currentUser?.evmAccounts?.[0] ?? undefined,
    chainId: base.id,
  });

  return {
    ...result,
    data: result.data
      ? Number(result.data.value) / 10 ** result.data.decimals
      : undefined,
  };
};
