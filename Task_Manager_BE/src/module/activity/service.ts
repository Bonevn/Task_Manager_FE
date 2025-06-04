import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { IPaginationResponse } from 'src/utils/paging';
// import { IPaginationResponse } from 'src/utils/paging';

export type Project = any;

@Injectable()
export class ActivitysService {
	constructor(private prisma: PrismaService) {}

	async createActivity(msg: string, userId: string) {
		const activity = await this.prisma.activity.create({
			data: {
				content: msg,
				userId,
			},
		});
		return activity;
	}

	async getListLatestActivity(page: number, pageSize: number) {
		const latestActivity = await this.prisma.activity.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				user: {
					select: {
						name: true,
						email: true,
						picture: true,
					},
				},
			},
			take: pageSize,
			skip: (page - 1) * pageSize,
		});
		return latestActivity;
	}
}
