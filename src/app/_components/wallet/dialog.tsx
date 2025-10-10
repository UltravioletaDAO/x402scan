import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { useAccount } from 'wagmi';
import { DisplayWalletDialogContent } from './display';
import { ConnectWalletDialogContent } from './connect';

interface Props {
  children: React.ReactNode;
}

export const WalletDialog: React.FC<Props> = ({ children }) => {
  const { address } = useAccount();

  const { currentUser } = useCurrentUser();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="p-0 overflow-hidden sm:max-w-sm"
        showCloseButton={false}
      >
        {address ? (
          <DisplayWalletDialogContent
            address={address}
            user={currentUser ?? undefined}
          />
        ) : (
          <ConnectWalletDialogContent />
        )}
      </DialogContent>
    </Dialog>
  );
};
