'use client';

import { useEffect, useState } from 'react';

import { useAccount, useSignMessage } from 'wagmi';
import { useCurrentUser } from '@coinbase/cdp-hooks';

import { signInWithEthereum } from '@/auth/providers/siwe/sign-in';

import { EmbeddedWalletOTP } from './otp';
import { EmbeddedWalletEmail } from './email';

export const EmbeddedWallet = () => {
  const [flowId, setFlowId] = useState('');

  const account = useAccount();

  const { currentUser } = useCurrentUser();

  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (account.address && currentUser) {
      void signInWithEthereum({
        address: account.address,
        chainId: 8453,
        signMessage: async message => {
          return await signMessageAsync({ message });
        },
        email: currentUser?.authenticationMethods.email?.email ?? '',
      });
    }
  }, [account.address, currentUser, signMessageAsync]);

  if (flowId) {
    return (
      <div className="space-y-4">
        <EmbeddedWalletOTP flowId={flowId} handleReset={() => setFlowId('')} />
      </div>
    );
  }

  return <EmbeddedWalletEmail setFlowId={setFlowId} />;
};
