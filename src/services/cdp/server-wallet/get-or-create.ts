import { CdpClient } from "@coinbase/cdp-sdk";
import { Account, toAccount } from "viem/accounts";

const cdpClient = new CdpClient();


export const getOrCreateWalletFromUserId = async (userId: string): Promise<Account> => {
    return toAccount(await cdpClient.evm.getOrCreateAccount({
        name: userId
      }));
};