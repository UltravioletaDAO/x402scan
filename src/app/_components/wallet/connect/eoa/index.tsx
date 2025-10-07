import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { useConnect } from 'wagmi';

export const ConnectEOAForm = () => {
  const { connectors, connectAsync, isPending } = useConnect();

  const onConnect = useCallback(async () => {
    const injectedConnector = connectors.find(
      connector => connector.id === 'injected'
    );
    if (!injectedConnector) {
      throw new Error('Injected connector not found');
    }
    await connectAsync({ connector: injectedConnector });
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
