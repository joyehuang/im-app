import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [WsService, WsGateway, PrismaService],
  exports: [WsService],
})
export class WsModule {}
