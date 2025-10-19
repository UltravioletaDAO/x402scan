import { Bot } from 'lucide-react';

import { useSession } from 'next-auth/react';

import { Loading } from '@/components/ui/loading';
import { Skeleton } from '@/components/ui/skeleton';

import { PromptInputButton } from '@/components/ai-elements/prompt-input';

import { WalletDialog } from '../../wallet/dialog';

import { api } from '@/trpc/client';

export const ServerWalletButton = () => {
  const { data: session } = useSession();

  const { data: address, isLoading: isLoadingAddress } =
    api.user.serverWallet.address.useQuery(undefined, {
      enabled: !!session,
    });

  const { data: usdcBalance, isLoading: isLoadingUsdcBalance } =
    api.user.serverWallet.usdcBaseBalance.useQuery(undefined, {
      enabled: !!session,
    });

  return (
    <Loading
      value={address}
      isLoading={isLoadingAddress}
      component={address => (
        <WalletDialog address={address}>
          <PromptInputButton variant="outline" size="sm">
            <Bot className="size-4" />
            <Loading
              isLoading={isLoadingUsdcBalance}
              value={usdcBalance}
              component={balance => (
                <span className="text-xs">{`${balance?.toPrecision(3)} USDC`}</span>
              )}
              loadingComponent={<Skeleton className="h-3 w-8" />}
            />
          </PromptInputButton>
        </WalletDialog>
      )}
      loadingComponent={<LoadingServerWalletButton />}
    />
  );
};

const LoadingServerWalletButton = () => {
  return (
    <PromptInputButton variant="outline" size="sm">
      <Bot className="size-4" />
      <Skeleton className="h-3 w-8" />
    </PromptInputButton>
  );
};
