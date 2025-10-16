import { auth } from '@/auth';
import { api } from '@/trpc/server';
import { Welcome } from './_components/welcome';

import { v4 as uuidv4 } from 'uuid';
import { Chat } from './_components/chat';
import { cookieToInitialState } from 'wagmi';
import { getServerConfig } from '@/app/_contexts/wagmi/config';
import { headers } from 'next/headers';

export default async function ChatPage() {
  const session = await auth();

  const initialState = cookieToInitialState(
    getServerConfig(),
    (await headers()).get('cookie')
  );

  console.log(initialState?.connections);

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
