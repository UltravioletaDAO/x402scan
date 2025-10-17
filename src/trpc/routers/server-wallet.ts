import { createTRPCRouter, protectedProcedure } from '@/trpc/trpc';

import {
  getUSDCBaseBalanceFromUserId,
  getWalletAddressFromUserId,
  createWalletForUserId,
} from '@/services/cdp/server-wallet';
import { getWalletNameForUserId } from '@/services/db/server-wallets';

export const serverWalletRouter = createTRPCRouter({
  exists: protectedProcedure.query(async ({ ctx }) => {
    return (await getWalletNameForUserId(ctx.session.user.id)) !== null;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    return await createWalletForUserId(ctx.session.user.id);
  }),

  address: protectedProcedure.query(async ({ ctx }) => {
    return await getWalletAddressFromUserId(ctx.session.user.id);
  }),

  usdcBaseBalance: protectedProcedure.query(async ({ ctx }) => {
    return await getUSDCBaseBalanceFromUserId(ctx.session.user.id);
  }),
});
