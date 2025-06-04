import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { createUserDTO } from './dto/create.dto';
import { hashPassword } from 'src/utils/hash_password';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDTO } from './dto/patch.dto';
import { UserRole } from '@prisma/client';
// import { IPaginationResponse } from 'src/utils/paging';

export type User = any;

@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async findOne(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});
		return user;
	}

	async findOneByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		return user;
	}

	async findAll(): Promise<User[]> {
		const users = await this.prisma.user.findMany();
		return users;
	}

	async create(data: createUserDTO): Promise<User> {
		const findUser = await this.prisma.user.findFirst({
			where: { email: data.email },
		});
		if (findUser) {
			throw new BadRequestException('User already exists');
		}
		const user = await this.prisma.user.create({
			data: {
				...data,
				password: hashPassword(data.password),
			},
		});
		delete user.password;
		const jwt = await this.jwtService.sign(user);
		return { user, jwt };
	}

	async getUserList(page: number = 1, pageSize: number = 10, keyword: string = '', role: UserRole = null) {
		const whereClause = {
		} as any;
		if (keyword) {
			whereClause.OR = [{ name: { contains: keyword } }, { email: { contains: keyword } }];
		}
		if (role !== null) {
			whereClause.role = role;
		}
		const users = await this.prisma.user.findMany({
			skip: (page - 1) * pageSize,
			take: pageSize,
			where: whereClause,
		});
		for (const user of users) {
			delete user.password;
		}
		return users;
	}

	async resetPassword(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});
		if (!user) {
			throw new BadRequestException('User not found');
		}
		const password = Math.random().toString(36).substring(2, 15);
		const hashedPassword = hashPassword(password);
		const updatedUser = await this.prisma.user.update({
			where: { id },
			data: { password: hashedPassword },
		});
		await this.prisma.activity.create({
			data: {
				userId: id,
				content: `Reset password for user ${updatedUser.name}`,
			},
		});
		return { password, email: updatedUser.email, name: updatedUser.name };
	}

	async updateProfile(userId: string, data: UpdateProfileDTO) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException('User not found');
		}
		const updatedUser = await this.prisma.user.update({
			where: { id: userId },
			data,
		});
		delete updatedUser.password;
		return updatedUser;
	}

	async checkUserRoleInProject(userId: string, projectId: string) {
		const userProject = await this.prisma.userProject.findFirst({
			where: { userId, projectId },
		});
		if (!userProject) {
			throw new HttpException("User not found in project", HttpStatus.BAD_REQUEST);
		}
		return userProject.role;
	}
}
