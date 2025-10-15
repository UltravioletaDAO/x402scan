import { MessageSquare } from 'lucide-react';

import { Breadcrumb } from '../../_components/breadcrumb';
import { Separator } from '../../_components/separator';
import { getChatById } from '@/services/db/chats';

export default async function ChatBreadcrumb({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = await getChatById(id);
  if (!chat) {
    return null;
  }
  return (
    <>
      <Separator />
      <Breadcrumb
        href={`/chat/${id}`}
        image={null}
        name={chat.title}
        Fallback={MessageSquare}
        mobileHideImage
      />
    </>
  );
}
