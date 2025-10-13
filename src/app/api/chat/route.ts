import { InvokeAgent } from '@/services/agent/core';
import { getOrCreateWalletFromUserId } from '@/services/cdp/server-wallet/get-or-create';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Signer } from 'x402/types';
import { UIMessage } from '@ai-sdk/react';
import type { ModelMessage, Tool } from 'ai';

export async function POST(request: Request) {
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const walletClient = await getOrCreateWalletFromUserId(session.user.id);

  const { model, selectedTools, messages }: { model: string, selectedTools: string[], messages: UIMessage[] } = await request.json();

  const result = await InvokeAgent(model, walletClient as Signer, messages, {});
  return NextResponse.json(result);
}