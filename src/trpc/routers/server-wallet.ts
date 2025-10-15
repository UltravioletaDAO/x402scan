import { createTRPCRouter, protectedProcedure } from '@/trpc/trpc';

import {
  getOrCreateWalletFromUserId,
  getUSDCBaseBalanceFromUserId,
  getWalletAddressFromUserId,
} from '@/services/cdp/server-wallet/get-or-create';
import { getWalletNameForUserId } from '@/services/db/server-wallets';

export const serverWalletRouter = createTRPCRouter({
  exists: protectedProcedure.query(async ({ ctx }) => {
    return (await getWalletNameForUserId(ctx.session.user.id)) !== null;
  }),

  wallet: protectedProcedure.query(async ({ ctx }) => {
    return await getOrCreateWalletFromUserId(ctx.session.user.id);
  }),

  address: protectedProcedure.query(async ({ ctx }) => {
    return await getWalletAddressFromUserId(ctx.session.user.id);
  }),

  usdcBaseBalance: protectedProcedure.query(async ({ ctx }) => {
    return await getUSDCBaseBalanceFromUserId(ctx.session.user.id);
  }),
});
