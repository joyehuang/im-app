import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async create(@Body() body: any, @GetUser('userId') userId: string) {
    return this.chatService.createConversation({
      ...body,
      userId,
    });
  }

  @Get()
  async findAll(@GetUser('userId') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body('skip') skip?: number,
    @Body('take') take?: number,
  ) {
    return this.chatService.getMessages(id, skip, take);
  }

  @Post(':id/messages')
  async createMessage(
    @Param('id') id: string,
    @Body() body: any,
    @GetUser('userId') userId: string,
  ) {
    return this.chatService.createMessage({
      ...body,
      conversationId: id,
      senderId: userId,
    });
  }

  @Put('messages/:id/read')
  async markAsRead(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ) {
    return this.chatService.markAsRead(id, userId);
  }

  @Put('messages/:id/revoke')
  async revokeMessage(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ) {
    return this.chatService.revokeMessage(id, userId);
  }

  @Put('messages/:id/edit')
  async editMessage(
    @Param('id') id: string,
    @Body('content') content: string,
    @GetUser('userId') userId: string,
  ) {
    return this.chatService.editMessage(id, userId, content);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body('memberId') memberId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.chatService.addMember(id, userId, memberId);
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.chatService.removeMember(id, userId, memberId);
  }
}
