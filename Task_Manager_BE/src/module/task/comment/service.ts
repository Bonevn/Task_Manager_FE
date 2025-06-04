import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { createCommentDTO } from './dto/create.dto';
import { IPaginationResponse } from 'src/utils/paging';

export type Comment = any;

export enum CommentOrderBy {
	PRIORITY = 'priority',
	STATUS = 'status',
	DUE_DATE = 'dueDate',
	CREATED_AT = 'createdAt',
}

@Injectable()
export class CommentsService {
	constructor(private prisma: PrismaService) {}

	async createComment(data: createCommentDTO, userId: string) {
		const task = await this.prisma.task.findUnique({
			where: { id: data.taskId },
		});
		if (!task) {
			throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
		}
		const createComment = await this.prisma.comment.create({
			data: {
				taskId: data.taskId,
				userId,
				content: data.content,
			},
		});
		return createComment;
	}

	async deleteComment(id: string) {
		const deleteComment = await this.prisma.comment.delete({
			where: { id },
		});
		return deleteComment;
	}

	async getComments(taskId: string) {
		const getComments = await this.prisma.comment.findMany({
			where: { taskId },
			orderBy: { createdAt: 'asc' },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						picture: true,
					},
				},
			},
		});

		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
			select: { projectId: true }
		});

		if (!task) {
			throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
		}

		const getUserRoles = await this.prisma.userProject.findMany({
			where: {
				userId: {
					in: getComments.map((comment) => comment.userId),
				},
				projectId: task.projectId,
			},
		});

		const commentsWithRoles = getComments.map((comment) => ({
			...comment,
			user: {
				...comment.user,
				role: getUserRoles.find((userRole) => userRole.userId === comment.userId)?.role || null
			}
		}));

		return commentsWithRoles;
	}

	async getRecentComments(taskId: string) {
		const getRecentComments = await this.prisma.comment.findMany({
			where: { taskId, createdAt: { gte: new Date(Date.now() - 1000 * 5) } },
			orderBy: { createdAt: 'desc' },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						picture: true,
					},
				},
			},
		});

		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
			select: { projectId: true }
		});

		if (!task) {
			throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
		}

		const getUserRoles = await this.prisma.userProject.findMany({
			where: {
				userId: {
					in: getRecentComments.map((comment) => comment.userId),
				},
				projectId: task.projectId,
			},
		});

		const commentsWithRoles = getRecentComments.map((comment) => ({
			...comment,
			user: {
				...comment.user,
				role: getUserRoles.find((userRole) => userRole.userId === comment.userId)?.role || null
			}
		}));

		return commentsWithRoles;
	}
}
