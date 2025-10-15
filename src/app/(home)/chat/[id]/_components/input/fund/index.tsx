import { Wallet } from 'lucide-react';

import { PromptInputButton } from '@/components/ui/ai-elements/prompt-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/client';

export const WalletButton = () => {
  const { data: usdcBalance, isLoading: isLoadingUsdcBalance } =
    api.serverWallet.usdcBaseBalance.useQuery(undefined);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <PromptInputButton aria-label="Fund wallet">
          <Wallet className="size-4" />
          {isLoadingUsdcBalance ? (
            <Skeleton className="h-4 w-8" />
          ) : (
            `${usdcBalance?.toPrecision(3)} USDC`
          )}
        </PromptInputButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Server Wallet</DialogTitle>
          <DialogDescription>
            Your server wallet can sign on your behalf. It is used to pay for
            LLM inference and tools via x402.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
