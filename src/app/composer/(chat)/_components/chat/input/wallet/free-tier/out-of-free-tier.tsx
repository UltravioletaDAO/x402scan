import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Deposit } from '../../../../wallet/deposit';

import { FreeTierButtonContent } from './button';

import type { Address } from 'viem';
import { useState } from 'react';

interface Props {
  address: Address;
  hideFreeTierButton: () => void;
}

export const OutOfFreeTier: React.FC<Props> = ({
  address,
  hideFreeTierButton,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      hideFreeTierButton();
    }
  };

  return (
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
  );
};
