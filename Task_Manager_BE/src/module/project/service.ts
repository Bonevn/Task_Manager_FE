import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { createProjectDTO } from './dto/create.dto';
import { IPaginationResponse } from 'src/utils/paging';
import { updateUserInProjectDTO } from './dto/update.dto';
import { UserProjectRole } from '@prisma/client';
import { UsersService } from '../users/users.service';

export type Project = any;

@Injectable()
export class ProjectsService {
	constructor(private prisma: PrismaService, private usersService: UsersService) {}

	async createProject(data: createProjectDTO, userId: string) {
		try {
			const projectFoundKey = await this.prisma.project.findUnique({
				where: { key: data.key },
			});
			if (projectFoundKey) {
				throw new HttpException('Key already exists', 400);
			}
			const project = await this.prisma.project.create({ data: { ...data, key: data.key.toUpperCase() } });
			await this.prisma.userProject.create({
				data: {
					userId: userId,
					projectId: project.id,
					role: UserProjectRole.OWNER,
				},
			});
			return project;
		} catch (error) {
			throw new HttpException(error, 400);
		}
	}

	async getProject(id: string, userId: string) {
		const project = await this.prisma.project.findUnique({ where: { id, UserProject: { some: { userId: userId } }, deletedAt: null } });
		if (!project) {
			throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
		}
		return project;
	}

	async getListProject(page: number, pageSize: number, keyword: string, userId: string) {
		let whereClause: any = {
			UserProject: {
				some: {
					userId: userId,
				},
			},
			deletedAt: null,
		};
		if (keyword) {
			whereClause = {
				OR: [
					{
						name: { contains: keyword, mode: 'insensitive' },
					},
					{
						key: { contains: keyword, mode: 'insensitive' },
					},
				],
			};
		}
		const data = await this.prisma.project.findMany({
			skip: (Number(page) - 1) * Number(pageSize),
			take: Number(pageSize),
			where: whereClause,
			orderBy: {
				updatedAt: 'desc',
			},
		});
		const total = await this.prisma.project.count({
			where: whereClause,
		});
		const pages: IPaginationResponse = {
			page,
			limit: pageSize,
			total,
		};
		return { data, pages };
	}

	async getProjectById(id: string) {
		try {
			return this.prisma.project.findUnique({
				where: { id },
				select: {
					id: true,
					name: true,
					key: true,
					description: true,
				},
			});
		} catch (error) {
			throw new HttpException(error, 400);
		}
	}

	async updateProject(id: string, data: createProjectDTO) {
		try {
			return this.prisma.project.update({ where: { id }, data });
		} catch (error) {
			throw new HttpException(error, 400);
		}
	}

	async deleteProject(id: string, userId: string) {
		const checkUserRole = await this.usersService.checkUserRoleInProject(userId, id);
		if (checkUserRole !== UserProjectRole.OWNER) {
			throw new HttpException('You are not allowed to delete project', HttpStatus.FORBIDDEN);
		}
		const project = await this.prisma.project.findUnique({ where: { id } });
		if (!project) {
			throw new HttpException('Project not found', HttpStatus.BAD_REQUEST);
		}
		await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
		await this.prisma.activity.create({
			data: {
				userId: userId,
				content: `Deleted project ${project.key}`,
			},
		});
		return true;
	}

	async getProjectListByUser(userId: string, page: number, pageSize: number, keyword: string) {
		let whereClause: any = {
			userId: userId,
		};
		if (keyword) {
			whereClause = {
				OR: [
					{ name: { contains: keyword, mode: 'insensitive' } },	
					{ key: { contains: keyword, mode: 'insensitive' } },
				],
			};
		}
		const getListProjectByUser = await this.prisma.userProject.findMany({
			take: Number(pageSize),
			skip: (Number(page) - 1) * Number(pageSize),
			where: whereClause,
			include: {
				project: {
					select: {
						id: true,
						name: true,
						key: true,
						description: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		});
		const total = await this.prisma.userProject.count({ where: whereClause });
		const pages: IPaginationResponse = {
			page,
			limit: pageSize,
			total,
		};
		return { data: getListProjectByUser, pages };
	}

	async getListUserInProject(projectId: string, page: number, pageSize: number,userId: string, keyword?: string, role?: UserProjectRole, ) {
		const checkUserRole = await this.usersService.checkUserRoleInProject(userId, projectId);
		if (!checkUserRole) {
			throw new HttpException('You are not allowed to get list user in project', HttpStatus.FORBIDDEN);
		}
		let whereClause: any = {
			projectId: projectId,
		};
		if (keyword) {
			whereClause = {
				OR: [
					{ user: { name: { contains: keyword, mode: 'insensitive' } } },
					{ user: { email: { contains: keyword, mode: 'insensitive' } } },
				],
			};
		}
		if (role) {
			whereClause = {
				role: role,
			};
		}
		const getListUserInProject = await this.prisma.userProject.findMany({
			take: Number(pageSize),
			skip: (Number(page) - 1) * Number(pageSize),
			where: whereClause,
			select: {
				id: true,
				role: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						picture: true,
					},
				},
			},
		});
		const total = await this.prisma.userProject.count({ where: whereClause });
		const pages: IPaginationResponse = {
			page,
			limit: pageSize,
			total,
		};
		return { data: getListUserInProject, pages };
	}

	async addUserInProject(projectId: string, userId: string, adminId: string, role: UserProjectRole) {
		const adminRole = await this.usersService.checkUserRoleInProject(adminId, projectId);
		if (adminRole !== UserProjectRole.ADMIN && adminRole !== UserProjectRole.OWNER) {
			throw new HttpException('You are not allowed to add user in project', HttpStatus.FORBIDDEN);
		}

		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
		}

		const userProject = await this.prisma.userProject.findFirst({
			where: { projectId, userId },
		});

		if (userProject) {
			throw new HttpException('User already in project', HttpStatus.BAD_REQUEST);
		}

		await this.prisma.activity.create({
			data: {
				userId: adminId,
				content: `Added user ${user.name} to project ${projectId}`,
			},
		});
		return this.prisma.userProject.create({ data: { projectId, userId, role } });
	}

	async updateUserInProject(projectId: string, userId: string, data: updateUserInProjectDTO, adminId: string) {
		const adminRole = await this.usersService.checkUserRoleInProject(adminId, projectId);
		if (adminRole !== UserProjectRole.ADMIN && adminRole !== UserProjectRole.OWNER) {
			throw new HttpException('You are not allowed to update user in project', HttpStatus.FORBIDDEN);
		}
		const userProject = await this.prisma.userProject.findFirst({
			where: { projectId, userId},
		});
		if (!userProject) {
			throw new HttpException('User not found in project', HttpStatus.BAD_REQUEST);
		}
		return this.prisma.userProject.update({ where: { id: userProject.id }, data: { role: data.role } });
	}

	async deleteUserInProject(projectId: string, userId: string, adminId: string) {
		const adminRole = await this.usersService.checkUserRoleInProject(adminId, projectId);
		if (adminRole !== UserProjectRole.ADMIN && adminRole !== UserProjectRole.OWNER) {
			throw new HttpException('You are not allowed to delete user in project', HttpStatus.FORBIDDEN);
		}
		const userProject = await this.prisma.userProject.findFirst({
			where: { projectId, userId },
		});
		if (!userProject) {
			throw new HttpException('User not found in project', HttpStatus.BAD_REQUEST);
		}
		return this.prisma.userProject.delete({ where: { id: userProject.id } });
	}
}
