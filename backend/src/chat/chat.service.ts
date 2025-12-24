import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(data: { type: string; name?: string; userId: string; memberIds: string[] }) {
    const conversation = await this.prisma.conversation.create({
      data: {
        type: data.type,
        name: data.name,
        createdBy: data.userId,
        members: {
          create: data.memberIds.map(memberId => ({
            userId: memberId,
            role: memberId === data.userId ? 'owner' : 'member',
          })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return conversation;
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async getMessages(conversationId: string, skip = 0, take = 50) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async createMessage(data: {
    conversationId: string;
    senderId: string;
    type: string;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) {
    return this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        type: data.type,
        content: data.content,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async markAsRead(messageId: string, userId: string) {
    return this.prisma.messageRead.create({
      data: {
        messageId,
        userId,
      },
    });
  }

  async revokeMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.senderId !== userId) {
      throw new Error('Not authorized to revoke this message');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  async editMessage(messageId: string, userId: string, content: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.senderId !== userId) {
      throw new Error('Not authorized to edit this message');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
    });
  }

  async addMember(conversationId: string, userId: string, memberId: string) {
    const member = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId,
        role: {
          in: ['owner', 'admin'],
        },
      },
    });

    if (!member) {
      throw new Error('Not authorized to add members');
    }

    return this.prisma.conversationMember.create({
      data: {
        conversationId,
        userId: memberId,
        role: 'member',
      },
    });
  }

  async removeMember(conversationId: string, userId: string, memberId: string) {
    const member = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId,
        role: {
          in: ['owner', 'admin'],
        },
      },
    });

    if (!member) {
      throw new Error('Not authorized to remove members');
    }

    return this.prisma.conversationMember.deleteMany({
      where: {
        conversationId,
        userId: memberId,
      },
    });
  }
}
