import { WelcomeContent } from './content';

import { auth } from '@/auth';

import { api } from '@/trpc/server';

export const Onboarding = async () => {
  const [isSignedIn, hasServerWallet, hasUsdcBalance] = await Promise.all([
    auth()
      .then(Boolean)
      .catch(() => false),
    api.serverWallet.exists().catch(() => false),
    api.serverWallet
      .usdcBaseBalance()
      .then(data => Boolean(data && data > 0))
      .catch(() => false),
  ]);

  if (isSignedIn && hasServerWallet && hasUsdcBalance) {
    return null;
  }

  const initialStep = !isSignedIn ? 1 : !hasServerWallet ? 2 : 3;

  return <WelcomeContent initialStep={initialStep} />;
};
