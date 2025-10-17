import Image from 'next/image';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Send } from './send';
import { Onramp } from './onramp';

import type { Address } from 'viem';
import { CopyCode } from '@/components/ui/copy-code';

interface Props {
  address: Address;
}

export const Deposit: React.FC<Props> = ({ address }) => {
  return (
    <Tabs defaultValue="send" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">Address</span>
        <CopyCode
          code={address}
          toastMessage="Address copied to clipboard"
          className="bg-transparent"
        />
      </div>
      <TabsList className="w-full justify-start gap-2 p-1 rounded-md bg-secondary">
        <TabsTrigger value="send" className="flex-1">
          <Image src="/base.png" alt="Base" height={16} width={16} />
          Send
        </TabsTrigger>
        <TabsTrigger value="onramp" className="flex-1">
          <Image
            src="/coinbase.png"
            alt="Coinbase"
            height={16}
            width={16}
            className="size-4 rounded-full"
          />
          Onramp
        </TabsTrigger>
      </TabsList>
      <TabsContent value="send" className="mt-0">
        <Send address={address} />
      </TabsContent>
      <TabsContent value="onramp" className="mt-0">
        <Onramp />
      </TabsContent>
    </Tabs>
  );
};
