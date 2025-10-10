import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import type { Connector } from 'wagmi';
import { useConnect } from 'wagmi';
import { base } from 'wagmi/chains';

export const ConnectEOAForm = () => {
  const { connectors, connectAsync, isPending } = useConnect();

  const onConnect = useCallback(
    async (connector: Connector) => {
      await connectAsync(
        { connector, chainId: base.id },
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
    },
    [connectAsync]
  );

  const filteredConnectors = connectors.filter(
    connector =>
      connector.type === 'injected' &&
      !['injected', 'cdp-embedded-wallet'].includes(connector.id)
  );

  return (
    <div className="flex flex-col gap-2">
      {connectors
        .filter(
          connector =>
            connector.type === 'injected' &&
            !['injected', 'cdp-embedded-wallet'].includes(connector.id)
        )
        .map(connector => (
          <Button
            key={connector.id}
            variant="outline"
            className="user-message w-full"
            onClick={() => onConnect(connector)}
            disabled={isPending}
          >
            {connector.icon && <img src={connector.icon} className="size-4" />}
            {connector.name}
          </Button>
        ))}
    </div>
  );
};
