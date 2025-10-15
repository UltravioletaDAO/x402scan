import { auth } from '@/auth';
import { api } from '@/trpc/server';
import { Welcome } from './_components/welcome';

import { v4 as uuidv4 } from 'uuid';
import { Chat } from './_components/chat';

export default async function ChatPage() {
  const session = await auth();

  // If not authenticated, redirect to home
  if (!session?.user?.id) {
    return <Welcome />;
  }

  const walletExists = await api.serverWallet.exists();
  if (!walletExists) {
    return <Welcome />;
  }

  const id = uuidv4();

  return <Chat id={id} initialMessages={[]} />;
}
