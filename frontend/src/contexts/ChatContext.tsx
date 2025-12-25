import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Conversation, Message } from '@/types';
import { conversationAPI } from '@/services/api';
import { socketService } from '@/services/socket';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  setCurrentConversation: (conversation: Conversation | null) => void;
  createConversation: (type: 'single' | 'group', name?: string, memberIds?: string[]) => Promise<void>;
  sendMessage: (content: string, type?: 'text' | 'image' | 'file', fileUrl?: string, fileName?: string, fileSize?: number) => Promise<void>;
  revokeMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  emitTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadConversations = async () => {
    try {
      const data = await conversationAPI.getAll();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await conversationAPI.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const createConversation = async (type: 'single' | 'group', name?: string, memberIds?: string[]) => {
    try {
      await conversationAPI.create({
        type,
        name,
        memberIds: memberIds || [],
      });
      await loadConversations();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const sendMessage = async (
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number
  ) => {
    if (!currentConversation) return;

    socketService.sendMessage({
      conversationId: currentConversation.id,
      senderId: JSON.parse(localStorage.getItem('user') || '{}').id,
      type,
      content,
      fileUrl,
      fileName,
      fileSize,
    });
  };

  const revokeMessage = async (messageId: string) => {
    try {
      await conversationAPI.revokeMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRevoked: true, revokedAt: new Date().toISOString() } : msg
        )
      );
    } catch (error) {
      console.error('Failed to revoke message:', error);
    }
  };

  const editMessage = async (messageId: string, content: string) => {
    try {
      await conversationAPI.editMessage(messageId, content);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content, isEdited: true, editedAt: new Date().toISOString() }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await conversationAPI.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
      );
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const emitTyping = (isTyping: boolean) => {
    if (currentConversation) {
      socketService.emitTyping(currentConversation.id, isTyping);
    }
  };

  useEffect(() => {
    socketService.onNewMessage((message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (currentConversation?.id === message.conversationId) {
        markAsRead(message.id);
      }
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
      socketService.joinConversation(currentConversation.id);
    }
    
    return () => {
      if (currentConversation) {
        socketService.leaveConversation(currentConversation.id);
      }
    };
  }, [currentConversation]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        setCurrentConversation,
        createConversation,
        sendMessage,
        revokeMessage,
        editMessage,
        markAsRead,
        loadConversations,
        loadMessages,
        emitTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
