import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Send } from './send';
import { Onramp } from './onramp';

import type { Address } from 'viem';

interface Props {
  address: Address;
}

export const Deposit: React.FC<Props> = ({ address }) => {
  return (
    <Tabs defaultValue="send" className="flex flex-col gap-2">
      <TabsList className="w-full justify-start gap-2 p-1 rounded-md bg-secondary">
        <TabsTrigger value="send" className="flex-1">
          Send
        </TabsTrigger>
        <TabsTrigger value="onramp" className="flex-1">
          Onramp
        </TabsTrigger>
      </TabsList>
      <TabsContent value="send">
        <Send address={address} />
      </TabsContent>
      <TabsContent value="onramp">
        <Onramp />
      </TabsContent>
    </Tabs>
  );
};
