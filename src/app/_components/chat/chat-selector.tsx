'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { api } from '@/trpc/client';
import { ChevronDown, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatSelectorProps {
  currentChatId?: string;
  onNewChat: () => void;
}

export const ChatSelector = ({ currentChatId, onNewChat }: ChatSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const { data: chats, refetch } = api.chats.getUserChats.useQuery();

  const deleteChatMutation = api.chats.deleteChat.useMutation({
    onSuccess: () => {
      void refetch();
      // If we deleted the current chat, navigate to new chat
      const deletedChat = chats?.find(chat => chat.id === currentChatId);
      if (deletedChat) {
        onNewChat();
      }
    },
  });

  const handleChatSelect = (chatId: string) => {
    void router.push(`/chat/${chatId}`);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    onNewChat();
    setIsOpen(false);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChatMutation.mutate({ chatId });
    }
  };

  const currentChat = chats?.find(chat => chat.id === currentChatId);

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">
                  {currentChat?.title ?? 'New Chat'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <Card className="mt-2 p-2 max-h-60 overflow-y-auto">
            {chats?.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No chats yet. Start a new conversation!
              </div>
            ) : (
              <div className="space-y-1">
                {chats?.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                      chat.id === currentChatId ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{chat.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {chat.messages.length > 0 && (
                          <>
                            Last message: {formatDistanceToNow(new Date(chat.messages[0].createdAt))} ago
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      disabled={deleteChatMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
