'use client';

import { Wallet as WalletIcon } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { api } from '@/trpc/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  onClick?: () => void;
}

export const WalletButton: React.FC<Props> = ({ onClick }) => {
  const { data: usdcBalance, isLoading: isLoadingUsdcBalance } =
    api.serverWallet.usdcBaseBalance.useQuery();

  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
      onClick={onClick}
    >
      <Avatar src={null} fallback={<WalletIcon className="size-5 m-1" />} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Agent Wallet</span>
        {isLoadingUsdcBalance ? (
          <Skeleton className="h-3 w-8" />
        ) : (
          <span className="text-xs">{`${usdcBalance?.toPrecision(3)} USDC`}</span>
        )}
      </div>
    </SidebarMenuButton>
  );
};
