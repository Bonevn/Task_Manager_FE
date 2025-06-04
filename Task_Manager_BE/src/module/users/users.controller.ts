import { Injectable, Patch, Controller, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { UpdateProfileDTO } from './dto/patch.dto';
import { UserRole } from '@prisma/client';
import jsonResponse from 'src/utils/json_response';
import { Param } from '@nestjs/common';
@Controller('')
@ApiTags('User')
@Injectable()
export class UserController {
	constructor(private userService: UsersService) {}

	@Patch('/profile')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiBody({ type: UpdateProfileDTO })
	async updateProfile(@Request() req, @Body() body: UpdateProfileDTO) {
		if (!req.user.id) {
			throw new BadRequestException('User not found');
		}
		return jsonResponse(await this.userService.updateProfile(req.user.id, body));
	}

	@Get()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	// @Roles(UserRole.ADMIN)	
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	@ApiQuery({ name: 'keyword', type: String, required: false })
	@ApiQuery({ name: 'role', type: String, required: false })
	async getUserList(@Request() req, @Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('role') role: UserRole) {
		return jsonResponse(await this.userService.getUserList(page, pageSize, keyword));
	}

	@Patch('reset-password/:id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async resetPassword(@Param('id') id: string) {
		return jsonResponse(await this.userService.resetPassword(id), 'Password reset successfully');
	}


	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiBody({ type: UpdateProfileDTO })
	async updateUser(@Request() req, @Param('id') id: string, @Body() body: UpdateProfileDTO) {
		return jsonResponse(await this.userService.updateProfile(id, body));
	}

	@Get('check-role-in-project')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async checkRoleInProject(@Request() req, @Query('projectId') projectId: string) {
		return jsonResponse(await this.userService.checkUserRoleInProject(req.user.id, projectId), 'User role in project', 200);
	}
}
