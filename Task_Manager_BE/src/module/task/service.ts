import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { createTaskDTO } from './dto/create.dto';
import { IPaginationResponse } from 'src/utils/paging';
import { updateTaskDTO } from './dto/update.dto';
import { TaskPriority } from '@prisma/client';
import { TaskStatus } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { MetadataType } from '../upload/dto/upload-file.dto';
import axios from 'axios';
// import { IPaginationResponse } from 'src/utils/paging';

export type Task = any;

export enum TaskOrderBy {
	PRIORITY = 'priority',
	STATUS = 'status',
	DUE_DATE = 'dueDate',
	CREATED_AT = 'createdAt',
}

@Injectable()
export class TasksService {
	constructor(
		private prisma: PrismaService,
		private userService: UsersService,
	) {}

	async createTask(data: createTaskDTO, userId: string) {
		const getProject = await this.prisma.project.findUnique({
			where: { id: data.projectId },
			select: { id: true, tasks: true, key: true },
		});
		if (!getProject) {
			throw new HttpException('Project not found', 400);
		}
		const sequence = getProject.tasks.length + 1;
		const createTask = await this.prisma.task.create({
			data: {
				name: data.name,
				description: data.description,
				projectId: data.projectId,
				sequence,
				priority: data?.priority,
				parentId: data?.parentId,
				assigneeId: data?.assigneeId,
				reporterId: data?.reporterId,
				dueDate: data?.dueDate,
				createdById: userId,
			},
			include: {
				project: {
					select: {
						name: true,
					},
				},
				assignee: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});
		await this.prisma.activity.create({
			data: {
				userId: userId,
				content: `Created task ${createTask.name} in project ${getProject.key}`,
			},
		});
		return createTask;
	}

	async getTask(id: string) {
		let getTask : any = await this.prisma.task.findUnique({
			where: { id },
			include: {
				project: {
					select: {
						name: true,
					},
				},
				assignee: {
					select: {
						name: true,
						email: true,
					},
				},
				subtasks: {
					select: {
						id: true,
						name: true,
						priority: true,
						dueDate: true,
						status: true,
						createdAt: true,
						assigneeId: true,
					},
				},
			},
		});
		if (!getTask) {
			throw new HttpException('Task not found', 400);
		}
		const Attachments = await this.prisma.file.findMany({
			where: {
				metadata: {
					path: ['id'],
					equals: getTask.id,
				},
				AND: {
					metadata: {
						path: ['type'],
						equals: MetadataType.TASK,
					},
				},
			},
		});
		getTask.attachments = Attachments;
		return getTask;
	}

	async getTasks(
		projectId: string,
		page: number,
		pageSize: number,
		name: string,
		assigneeId: string,
		orderBy: TaskOrderBy = TaskOrderBy.CREATED_AT,
		orderDirection: 'asc' | 'desc' = 'desc',
		status: TaskStatus,
		priority: TaskPriority,
		excludeDone: boolean = false,
	) {
		const whereClause: any = {
			deletedAt: null,
		};

		if (projectId) {
			whereClause.projectId = projectId;
		}

		if (name) {
			whereClause.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (assigneeId) {
			whereClause.assigneeId = assigneeId;
		}

		if (status) {
			whereClause.status = status;
		}

		if (priority) {
			whereClause.priority = priority;
		}

		if (excludeDone) {
			whereClause.status = { not: TaskStatus.DONE };
		}

		const orderByConfig = {
			[TaskOrderBy.PRIORITY]: { priority: orderDirection },
			[TaskOrderBy.STATUS]: { status: orderDirection },
			default: { [orderBy]: orderDirection },
		};

		const getTasks = await this.prisma.task.findMany({
			where: whereClause,
			include: {
				project: {
					select: {
						name: true,
					},
				},
				assignee: {
					select: {
						name: true,
						email: true,
						picture: true,
					},
				},
				reporter: {
					select: {
						name: true,
						email: true,
					},
				},
			},
			skip: (Number(page) - 1) * Number(pageSize),
			take: Number(pageSize),
			orderBy: orderByConfig[orderBy] || orderByConfig.default,
		});

		const total = await this.prisma.task.count({ where: whereClause });
		const pages: IPaginationResponse = {
			total,
			page,
			limit: pageSize,
		};
		return { data: getTasks, pages };
	}

	async updateTask(id: string, data: updateTaskDTO, userId: string) {
		const findTask = await this.prisma.task.findUnique({ where: { id } });
		if (!findTask) {
			throw new HttpException('Task not found', 400);
		}
		const checkRoleInProject = await this.userService.checkUserRoleInProject(
			data.assigneeId,
			findTask.projectId,
		);
		if (!checkRoleInProject) {
			throw new HttpException('User not have permission to update task', 400);
		}
		const getTask = await this.prisma.task.findUnique({ where: { id } });
		if (!getTask) {
			throw new HttpException('Task not found', 400);
		}
		if (data?.assigneeId) {
			const getAssignee = await this.prisma.user.findUnique({ where: { id: data.assigneeId } });
			if (!getAssignee) {
				throw new HttpException('Assignee not found', 400);
			}
			const findInProject = await this.prisma.userProject.findFirst({
				where: {
					userId: data.assigneeId,
					projectId: getTask.projectId,
				},
			});
			if (!findInProject) {
				throw new HttpException('Project not found', 400);
			}
			if (!findInProject) {
				throw new HttpException('Assignee not found in project', 400);
			}
		}

		if (data?.reporterId) {
			const getReporter = await this.prisma.user.findUnique({ where: { id: data.reporterId } });
			if (!getReporter) {
				throw new HttpException('Reporter not found', 400);
			}
			const findInProject = await this.prisma.userProject.findFirst({
				where: {
					userId: data.reporterId,
					projectId: getTask.projectId,
				},
			});
			if (!findInProject) {
				throw new HttpException('Reporter not found in project', 400);
			}
		}

		const updateTask = await this.prisma.task.update({
			where: { id },
			data: {
				name: data?.name,
				description: data?.description,
				assigneeId: data?.assigneeId,
				reporterId: data?.reporterId,
				status: data?.status,
				priority: data?.priority,
				selected: data?.selected,
				dueDate: data?.dueDate,
			},
			include: {
				project: {
					select: {
						name: true,
						key: true,
					},
				},
				assignee: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});
		await this.prisma.activity.create({
			data: {
				userId,
				content: `Updated task ${updateTask.name} in project ${updateTask.project.key}`,
			},
		});
		return updateTask;
	}

	async deleteTask(id: string) {
		const getTask = await this.prisma.task.findUnique({
			where: { id },
			include: { project: { select: { key: true } } },
		});
		if (!getTask) {
			throw new HttpException('Task not found', 400);
		}
		const deleteTask = await this.prisma.task.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
		await this.prisma.activity.create({
			data: {
				userId: getTask.assigneeId,
				content: `Deleted task ${getTask.name} in project ${getTask.project.key}`,
			},
		});
		return deleteTask;
	}
}
