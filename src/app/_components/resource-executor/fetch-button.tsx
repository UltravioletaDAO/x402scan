import { useCurrentUser, useIsInitialized } from '@coinbase/cdp-hooks';
import { ConnectEmbeddedWalletDialog } from '../auth/embedded-wallet/connect/dialog';
import { useWalletClient } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Wallet } from 'lucide-react';

export const FetchButton = () => {
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useWalletClient();
  const { isInitialized } = useIsInitialized();
  const { currentUser } = useCurrentUser();

  if (!walletClient || !currentUser) {
    return (
      <ConnectEmbeddedWalletDialog>
        <Button variant="turbo">
          <Wallet className="size-4" />
          Connect Wallet
        </Button>
      </ConnectEmbeddedWalletDialog>
    );
  }

  return (
    <Button
      variant="turbo"
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
          <span className="opacity-60">
            ${formatMicrosToValue(paymentValue.toString())}
          </span>
        </>
      )}
    </Button>
  );
};
