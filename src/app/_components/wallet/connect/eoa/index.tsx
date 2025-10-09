import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useConnect } from 'wagmi';
import { base } from 'wagmi/chains';

export const ConnectEOAForm = () => {
  const { connectors, connectAsync, isPending } = useConnect();

  const onConnect = useCallback(async () => {
    const injectedConnector = connectors.find(
      connector => connector.id === 'injected'
    );
    if (!injectedConnector) {
      throw new Error('Injected connector not found');
    }
    await connectAsync(
      { connector: injectedConnector, chainId: base.id },
      {
        onSuccess: () => {
          void toast.success('Connected to wallet');
        },
        onError: error => {
          console.error(error);
          void toast.error(error.message);
        },
      }
    );
  }, [connectors, connectAsync]);

  return (
    <Button
      variant="turbo"
      className="user-message h-12 md:h-12 w-full"
      onClick={onConnect}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};
