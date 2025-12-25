export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  status?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'image' | 'file';
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: string;
  isRevoked: boolean;
  revokedAt?: string;
  createdAt: string;
  sender: User;
}

export interface Conversation {
  id: string;
  type: 'single' | 'group';
  name?: string;
  avatar?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: ConversationMember[];
  messages?: Message[];
}

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
