import { Module } from '@nestjs/common';
import { CommentsService } from './service';
import { PrismaService } from 'src/utils/prisma.service';
import { CommentController } from './controller';
@Module({
	providers: [CommentsService, PrismaService],
	exports: [CommentsService],
	controllers: [CommentController],
})
export class CommentsModule {}
