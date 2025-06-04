import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { IPaginationResponse } from 'src/utils/paging';
import { TaskStatus, UserProjectRole } from '@prisma/client';
// import { IPaginationResponse } from 'src/utils/paging';

export type Project = any;

@Injectable()
export class DashboardsService {
	constructor(private prisma: PrismaService) {}

	async getListLatestActivity(page: number, pageSize: number) {
		const latestActivity = await this.prisma.activity.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: pageSize,
			skip: (page - 1) * pageSize,
		});
		return latestActivity;
	}

	async getCountTaskByStatus(userId: string): Promise<Record<TaskStatus, number>> {
		const countTaskByStatus = await this.prisma.task.groupBy({
			by: ['status'],
			_count: true,
			where: {
				assigneeId: userId,
			},
		});
		const result: Record<TaskStatus, number> = {
			[TaskStatus.TODO]: 0,
			[TaskStatus.IN_PROGRESS]: 0,
			[TaskStatus.DONE]: 0,
		};
		countTaskByStatus.forEach(({ status, _count }) => {
			result[status as TaskStatus] = _count;
		});
		return result;
	}

	async getCountTaskByProjectAndStatus(userId: string): Promise<any[]> {
		const getlistProject = await this.prisma.project.findMany({
			where: {
				UserProject: {
					some: { userId: userId },
				},
			},
			select: { id: true, key: true },
		});

		const grouped = await this.prisma.task.groupBy({
			by: ['projectId', 'status'],
			_count: { projectId: true },
			where: {
				assigneeId: userId,
			},
		});

		const projectIdToKey = Object.fromEntries(getlistProject.map(p => [p.id, p.key]));

		const projectMap: Record<string, any> = {};
		grouped.forEach(({ projectId }) => {
			const projectKey = projectIdToKey[projectId];
			if (!projectKey) return;
			if (!projectMap[projectKey]) {
				projectMap[projectKey] = {
					projectId: projectId,
					projectKey: projectKey,
					[TaskStatus.TODO]: 0,
					[TaskStatus.IN_PROGRESS]: 0,
					[TaskStatus.DONE]: 0,
				};
			}
		});

		grouped.forEach(({ projectId, status, _count }) => {
			const projectKey = projectIdToKey[projectId];
			if (!projectKey || !projectMap[projectKey]) return;
			projectMap[projectKey][status] = _count.projectId;
		});

		return Object.values(projectMap);
	}
}
