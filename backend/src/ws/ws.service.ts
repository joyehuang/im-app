import { Injectable } from '@nestjs/common';

@Injectable()
export class WsService {
  private connectedClients = new Map<string, any>();

  addClient(userId: string, client: any) {
    this.connectedClients.set(userId, client);
  }

  removeClient(userId: string) {
    this.connectedClients.delete(userId);
  }

  getClient(userId: string) {
    return this.connectedClients.get(userId);
  }

  sendMessageToUser(userId: string, event: string, data: any) {
    const client = this.getClient(userId);
    if (client) {
      client.emit(event, data);
    }
  }

  broadcastToConversation(conversationId: string, event: string, data: any) {
    this.connectedClients.forEach((client) => {
      client.emit(event, data);
    });
  }
}
