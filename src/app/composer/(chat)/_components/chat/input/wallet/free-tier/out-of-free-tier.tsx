import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Deposit } from '../../../../wallet/content/deposit';

import { FreeTierButtonContent } from './button';

import type { Address } from 'viem';
import { useEffect, useState } from 'react';
import { Acknowledgement } from '../../../../wallet/acknowledgement';
import { api } from '@/trpc/client';

interface Props {
  address: Address;
  hideFreeTierButton: () => void;
}

export const OutOfFreeTier: React.FC<Props> = ({
  address,
  hideFreeTierButton,
}) => {
  const { data: hasUserAcknowledgedComposer } =
    api.user.acknowledgements.hasAcknowledged.useQuery();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasUserAcknowledgedComposer) {
      setIsOpen(true);
    }
  }, [hasUserAcknowledgedComposer]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      hideFreeTierButton();
    }
  };

  return (
    <>
      <Acknowledgement />
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <FreeTierButtonContent />
        </DialogTrigger>
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="border-b bg-muted p-4">
            <DialogTitle>You Used All of Your Free x402 Credits</DialogTitle>
            <DialogDescription>
              Please fund your agent with USDC to continue.
            </DialogDescription>
          </DialogHeader>
          <Deposit address={address} onSuccess={hideFreeTierButton} />
          <p className="text-muted-foreground text-xs font-mono p-4 bg-muted border-t text-center">
            These funds will go to your agent&apos;s server wallet and will be
            used to pay for inference and resources via x402.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
