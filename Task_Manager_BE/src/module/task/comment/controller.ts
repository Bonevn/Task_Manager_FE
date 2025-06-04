import {
	Injectable,
	Patch,
	Controller,
	Body,
	Post,
	Get,
	Query,
	Delete,
	Param,
	Req,
} from '@nestjs/common';
import { CommentsService } from './service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/module/auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import jsonResponse from 'src/utils/json_response';
import { createCommentDTO } from './dto/create.dto';
@Controller('')
@ApiTags('Comment')
@Injectable()
export class CommentController {
	constructor(private CommentService: CommentsService) {}

	@Post()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiBody({ type: createCommentDTO })
	async createComment(@Body() body: createCommentDTO, @Req() req: any) {
		return jsonResponse(await this.CommentService.createComment(body, req.user.id), 'Comment created', 200);
	}

	@Get(':taskId')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getComments(@Param('taskId') taskId: string) {
		return jsonResponse(await this.CommentService.getComments(taskId), 'Comments fetched', 200);
	}

	@Get('/:taskId/recent')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getRecentComments(@Param('taskId') taskId: string) {
		return jsonResponse(await this.CommentService.getRecentComments(taskId), 'Recent comments fetched', 200);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async deleteComment(@Param('id') id: string) {
		return jsonResponse(await this.CommentService.deleteComment(id), 'Comment deleted', 200);
	}
}
