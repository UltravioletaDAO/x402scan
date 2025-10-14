import { InvokeAgent } from '@/services/agent/core';
import { getOrCreateWalletFromUserId } from '@/services/cdp/server-wallet/get-or-create';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Signer } from 'x402/types';
import { UIMessage } from '@ai-sdk/react';
import type { ModelMessage, Tool } from 'ai';
import { toAccount } from 'viem/accounts';
import { getSelectedTools } from '@/services/agent/core';
export async function POST(request: Request) {
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  console.log(session.user.id);
  const walletClient = await getOrCreateWalletFromUserId(session.user.id);

  const { model, selectedTools, messages }: { model: string, selectedTools: string[], messages: UIMessage[] } = await request.json();

  const toolsToCallWith = await getSelectedTools(toAccount(walletClient) as Signer, selectedTools);

  
  const result = await InvokeAgent(model, toAccount(walletClient) as Signer, messages, toolsToCallWith);
  return result.toUIMessageStreamResponse();
}