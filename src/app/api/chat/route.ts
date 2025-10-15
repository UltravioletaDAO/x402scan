import { NextResponse } from 'next/server';

import { InvokeAgent } from '@/services/agent/core';
import { getOrCreateWalletFromUserId } from '@/services/cdp/server-wallet/get-or-create';
import { auth } from '@/auth';

import { toAccount } from 'viem/accounts';
import { getSelectedTools } from '@/services/agent/core';
import { createMessage } from '@/services/db/chats';

import type { NextRequest } from 'next/server';
import type { Signer } from 'x402/types';
import { chatRequestBodySchema } from './schema';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const walletClient = await getOrCreateWalletFromUserId(session.user.id);

  const requestBody = chatRequestBodySchema.safeParse(await request.json());

  if (!requestBody.success) {
    return NextResponse.json({ error: requestBody.error }, { status: 400 });
  }

  const { model, selectedTools, messages, chatId } = requestBody.data;

  const toolsToCallWith = await getSelectedTools(
    toAccount(walletClient) as Signer,
    selectedTools
  );
  // Only save the newest user message to the database, onFinish
  // will save the rest.
  const lastMessage = messages[messages.length - 1];
  await createMessage({
    role: lastMessage.role,
    parts: JSON.stringify(lastMessage.parts),
    attachments: {},
    chat: {
      connect: { id: chatId },
    },
  });

  const result = await InvokeAgent(
    model,
    toAccount(walletClient) as Signer,
    messages,
    toolsToCallWith
  );

  // save the result to the database

  return result.toUIMessageStreamResponse({
    onFinish: async message => {
      for (const msg of message.messages) {
        await createMessage({
          role: msg.role,
          parts: JSON.stringify(msg.parts),
          attachments: {},
          chat: { connect: { id: chatId } },
        });
      }
    },
  });
}
