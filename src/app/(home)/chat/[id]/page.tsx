import { notFound, unauthorized } from 'next/navigation';

import { Chat } from './_components/chat';

import { api } from '@/trpc/server';

import { auth } from '@/auth';

export default async function ChatPage({ params }: PageProps<'/chat/[id]'>) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    return unauthorized();
  }

  const userId = session.user.id;

  const chat = await api.chats.getOrCreateChat({
    chatId: id,
    title: 'New Chat',
    visibility: 'private',
  });

  if (!chat) {
    return notFound();
  }

  // Verify chat ownership if chatId was provided
  if (chat.userId !== userId) {
    return unauthorized();
  }

  return <Chat chat={chat} />;
}
