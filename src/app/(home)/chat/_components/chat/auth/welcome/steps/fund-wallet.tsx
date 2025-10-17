import { api } from '@/trpc/client';
import { Onramp } from '../../../deposit/onramp';
import { Send } from '../../../deposit/send';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const FundWallet = () => {
  const { data: address } = api.serverWallet.address.useQuery();

  return (
    <Tabs
      defaultValue="send"
      className="flex flex-col gap-2 w-full overflow-hidden"
    >
      <p className="text-muted-foreground text-xs font-mono mb-2">
        These funds will go to your agent&apos;s server wallet and will be used
        to pay for inference and resources via x402.
      </p>
      <TabsList className="w-full justify-start gap-2 p-1 rounded-md bg-secondary">
        <TabsTrigger value="send" className="flex-1">
          Send
        </TabsTrigger>
        <TabsTrigger value="onramp" className="flex-1">
          Onramp
        </TabsTrigger>
      </TabsList>
      <TabsContent value="send">
        {address && <Send address={address} />}
      </TabsContent>
      <TabsContent value="onramp">
        <Onramp />
      </TabsContent>
    </Tabs>
  );
};
