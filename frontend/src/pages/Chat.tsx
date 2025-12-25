import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MoreVertical, Edit2, RotateCcw, File } from 'lucide-react';
import type { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export const Chat = () => {
  const {
    conversations,
    currentConversation,
    messages,
    setCurrentConversation,
    loadConversations,
    sendMessage,
    revokeMessage,
    editMessage,
    emitTyping,
  } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation) return;

    await sendMessage(messageText);
    setMessageText('');
  };

  const handleRevokeMessage = async (messageId: string) => {
    if (confirm('Are you sure you want to revoke this message?')) {
      await revokeMessage(messageId);
    }
  };

  const handleEditMessage = async (message: Message) => {
    if (!editText.trim()) return;

    await editMessage(message.id, editText);
    setEditingMessage(null);
    setEditText('');
  };

  const startEdit = (message: Message) => {
    setEditingMessage(message);
    setEditText(message.content || '');
  };

  const getConversationName = () => {
    if (!currentConversation) return '';
    if (currentConversation.type === 'single') {
      const otherMember = currentConversation.members.find(
        (m) => m.userId !== user?.id
      );
      return otherMember?.user.nickname || otherMember?.user.username || 'Unknown';
    }
    return currentConversation.name || 'Group Chat';
  };

  return (
    <div className="flex h-screen bg-background">
      <Card className="w-80 border-r rounded-none">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Conversations</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setCurrentConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                currentConversation?.id === conversation.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {conversation.type === 'group'
                      ? conversation.name?.charAt(0) || 'G'
                      : conversation.members
                          .find((m) => m.userId !== user?.id)
                          ?.user.nickname?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {conversation.type === 'group'
                      ? conversation.name
                      : conversation.members
                          .find((m) => m.userId !== user?.id)
                          ?.user.nickname || 'Unknown'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.messages?.[0]?.content ||
                      conversation.messages?.[0]?.fileName ||
                      'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>

      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{getConversationName()}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentConversation.type === 'group'
                      ? `${currentConversation.members.length} members`
                      : currentConversation.members
                          .find((m) => m.userId !== user?.id)
                          ?.user.username || ''}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.isRevoked ? (
                        <p className="text-sm italic opacity-70">Message revoked</p>
                      ) : editingMessage?.id === message.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEditMessage(message);
                              } else if (e.key === 'Escape') {
                                setEditingMessage(null);
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditMessage(message)}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingMessage(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-sm mb-1">
                            {message.sender.nickname || message.sender.username}
                          </p>
                          {message.type === 'text' && (
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          )}
                          {message.type === 'file' && (
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4" />
                              <a
                                href={`http://localhost:3001${message.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {message.fileName}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2 gap-4">
                            <span className="text-xs opacity-70">
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                              })}
                              {message.isEdited && ' (edited)'}
                              {message.isRead && ' ✓'}
                            </span>
                            {message.senderId === user?.id && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => startEdit(message)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleRevokeMessage(message.id)}
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    emitTyping(!!e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
