import { io, Socket } from 'socket.io-client';
import type { Message } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.userId = userId;
    this.socket = io(WS_URL, {
      query: { userId },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('joinConversation', { conversationId, userId: this.userId });
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('leaveConversation', { conversationId, userId: this.userId });
    }
  }

  sendMessage(data: {
    conversationId: string;
    senderId: string;
    type: string;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) {
    if (this.socket) {
      this.socket.emit('sendMessage', data);
    }
  }

  onNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  emitTyping(conversationId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, userId: this.userId, isTyping });
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();
