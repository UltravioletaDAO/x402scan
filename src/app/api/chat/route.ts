import { NextResponse } from 'next/server';

import { convertToModelMessages, stepCountIs, streamText } from 'ai';

import { toAccount } from 'viem/accounts';

import { createX402OpenAI } from '@merit-systems/ai-x402/server';

import { getOrCreateWalletFromUserId } from '@/services/cdp/server-wallet/get-or-create';

import { createMessage } from '@/services/db/chats';

import { auth } from '@/auth';

import { chatRequestBodySchema } from './schema';

import { createX402AITools } from '@/services/agent/get-tools';

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requestBody = chatRequestBodySchema.safeParse(await request.json());

  if (!requestBody.success) {
    return NextResponse.json({ error: requestBody.error }, { status: 400 });
  }

  const { model, selectedTools, messages, chatId } = requestBody.data;

  const wallet = await getOrCreateWalletFromUserId(session.user.id);
  const signer = toAccount(wallet);

  const lastMessage = messages[messages.length - 1];
  await createMessage({
    role: lastMessage.role,
    parts: JSON.stringify(lastMessage.parts),
    attachments: {},
    chat: {
      connect: { id: chatId },
    },
  });

  const allTools = await createX402AITools(signer);
  const tools = Object.fromEntries(
    selectedTools.map(tool => [tool, allTools[tool]])
  );

  const openai = createX402OpenAI(signer);
  const result = streamText({
    model: openai(model),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(50),
    tools,
  });

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
