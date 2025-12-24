import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    const fileUrl = `/uploads/${file.filename}`;
    return fileUrl;
  }
}
