import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @GetUser('userId') userId: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.fileService.uploadFile(file, userId);
  }
}
