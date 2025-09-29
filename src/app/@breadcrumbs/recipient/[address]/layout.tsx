import { Wallet } from "lucide-react";

import { Breadcrumb } from "../../_components/breadcrumb";

import { formatAddress } from "@/lib/utils";
import { Separator } from "../../_components/separator";

export default async function RecipientPage({
  params,
  children,
}: LayoutProps<"/recipient/[address]">) {
  const { address } = await params;
  return (
    <>
      <Separator />
      <Breadcrumb
        href={`/recipient/${address}`}
        image={null}
        name={formatAddress(address)}
        Fallback={Wallet}
      />
      {children}
    </>
  );
}
