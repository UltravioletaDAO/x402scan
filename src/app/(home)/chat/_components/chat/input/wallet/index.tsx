import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';

import { WalletDisplay } from './display';
import { Deposit } from './deposit';

import { api } from '@/trpc/client';

export const WalletButton = () => {
  const { data: usdcBalance, isLoading: isLoadingUsdcBalance } =
    api.serverWallet.usdcBaseBalance.useQuery(undefined);

  const { data: address, isLoading: isLoadingAddress } =
    api.serverWallet.address.useQuery(undefined);

  if (isLoadingAddress || isLoadingUsdcBalance) {
    return (
      <WalletButtonComponent
        isLoadingAddress={isLoadingAddress}
        isLoadingUsdcBalance={isLoadingUsdcBalance}
        usdcBalance={usdcBalance ?? 0}
      />
    );
  }

  if (!address) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <WalletButtonComponent
          isLoadingAddress={isLoadingAddress}
          isLoadingUsdcBalance={isLoadingUsdcBalance}
          usdcBalance={usdcBalance ?? 0}
        />
      </DialogTrigger>
      <DialogContent
        className="p-0 overflow-hidden sm:max-w-sm"
        showCloseButton={false}
      >
        <Tabs
          className="w-full overflow-hidden flex flex-col gap-4 pb-4"
          defaultValue={usdcBalance === 0 ? 'deposit' : 'wallet'}
        >
          <DialogHeader className=" gap-2 bg-muted">
            <div className="flex flex-row gap-2 items-center p-4">
              <Logo className="size-8" />
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-primary text-xl">
                  Your Server Wallet
                </DialogTitle>
                <DialogDescription className="hidden">
                  This is your wallet.
                </DialogDescription>
              </div>
            </div>
            <TabsList className="w-full h-fit">
              <div className="h-[34px] border-b w-4" />
              <TabsTrigger
                value="wallet"
                variant="github"
                className="data-[state=active]:bg-background"
              >
                <Wallet className="size-4" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="deposit"
                variant="github"
                className="data-[state=active]:bg-background"
              >
                <ArrowDown className="size-4" /> Deposit
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                variant="github"
                className="data-[state=active]:bg-background"
              >
                <ArrowUp className="size-4" /> Withdraw
              </TabsTrigger>
              <div className="h-[34px] border-b flex-1" />
            </TabsList>
          </DialogHeader>

          <TabsContent
            value="wallet"
            className="px-4 w-full overflow-hidden mt-0"
          >
            <WalletDisplay address={address} balance={usdcBalance ?? 0} />
          </TabsContent>
          <TabsContent
            value="deposit"
            className="px-4 w-full overflow-hidden mt-0 flex flex-col gap-2"
          >
            {usdcBalance === 0 && (
              <p className="text-xs text-muted-foreground">
                Your server wallet will be used to make x402 requests. Please
                add USDC on Base to continue.
              </p>
            )}
            <Deposit address={address} />
          </TabsContent>
          <TabsContent
            value="withdraw"
            className="px-4 w-full overflow-hidden mt-0"
          >
            CCC
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface WalletButtonComponentProps {
  onClick?: () => void;
  isLoadingAddress: boolean;
  isLoadingUsdcBalance: boolean;
  usdcBalance: number;
}

const WalletButtonComponent = ({
  onClick,
  isLoadingAddress,
  isLoadingUsdcBalance,
  usdcBalance,
}: WalletButtonComponentProps) => {
  return (
    <PromptInputButton
      aria-label="Fund wallet"
      variant="outline"
      size="sm"
      disabled={isLoadingAddress || isLoadingUsdcBalance}
      onClick={onClick}
    >
      <Wallet className="size-3" />
      {isLoadingAddress || isLoadingUsdcBalance ? (
        <Skeleton className="h-3 w-8" />
      ) : (
        <span className="text-xs">{`${usdcBalance?.toPrecision(3)} USDC`}</span>
      )}
    </PromptInputButton>
  );
};
