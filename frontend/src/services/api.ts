import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User, Conversation, Message } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const userAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export const conversationAPI = {
  create: async (data: { type: string; name?: string; memberIds: string[] }): Promise<Conversation> => {
    const response = await api.post('/conversations', data);
    return response.data;
  },
  
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations');
    return response.data;
  },
  
  getMessages: async (id: string, skip = 0, take = 50): Promise<Message[]> => {
    const response = await api.get(`/conversations/${id}/messages`, {
      params: { skip, take },
    });
    return response.data;
  },
  
  sendMessage: async (id: string, data: Partial<Message>): Promise<Message> => {
    const response = await api.post(`/conversations/${id}/messages`, data);
    return response.data;
  },
  
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/conversations/messages/${id}/read`);
  },
  
  revokeMessage: async (id: string): Promise<Message> => {
    const response = await api.put(`/conversations/messages/${id}/revoke`);
    return response.data;
  },
  
  editMessage: async (id: string, content: string): Promise<Message> => {
    const response = await api.put(`/conversations/messages/${id}/edit`, { content });
    return response.data;
  },
  
  addMember: async (id: string, memberId: string): Promise<ConversationMember> => {
    const response = await api.post(`/conversations/${id}/members`, { memberId });
    return response.data;
  },
  
  removeMember: async (id: string, memberId: string): Promise<void> => {
    await api.delete(`/conversations/${id}/members/${memberId}`);
  },
};

export default api;
