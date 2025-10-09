import { useCurrentUser, useIsInitialized } from '@coinbase/cdp-hooks';
import { ConnectEmbeddedWalletDialog } from '../../../auth/embedded-wallet/connect/dialog';
import { useWalletClient } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Wallet } from 'lucide-react';
import { formatTokenAmount } from '@/lib/token';
import { useResourceFetch } from '../contexts/fetch/hook';

export const FetchButton = () => {
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useWalletClient();
  const { isInitialized } = useIsInitialized();
  const { currentUser } = useCurrentUser();

  const { execute, isPending, allRequiredFieldsFilled, maxAmountRequired } =
    useResourceFetch();

  if (!walletClient || !currentUser) {
    return (
      <ConnectEmbeddedWalletDialog>
        <Button variant="ghost" size="sm" className="size-fit p-0 md:px-1">
          <Wallet className="size-4" />
          Connect Wallet
        </Button>
      </ConnectEmbeddedWalletDialog>
    );
  }

  return (
    <Button
      variant="primaryGhost"
      size="sm"
      className="size-fit p-0 md:px-1"
      disabled={
        isPending ||
        !allRequiredFieldsFilled ||
        isLoadingWalletClient ||
        !isInitialized ||
        !walletClient ||
        !currentUser
      }
      onClick={() => execute()}
    >
      {isLoadingWalletClient ||
      !isInitialized ||
      !walletClient ||
      !currentUser ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Fetching
        </>
      ) : (
        <>
          <Play className="size-4" />
          Fetch
          <span>{formatTokenAmount(maxAmountRequired)}</span>
        </>
      )}
    </Button>
  );
};
