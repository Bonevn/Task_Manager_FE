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
import { ProjectsService } from './service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import jsonResponse from 'src/utils/json_response';
import { createProjectDTO } from './dto/create.dto';
import { updateProjectDTO, updateUserInProjectDTO } from './dto/update.dto';
import { UserProjectRole } from '@prisma/client';
@Controller('')
@ApiTags('Project')
@Injectable()
export class ProjectController {
	constructor(private ProjectService: ProjectsService) {}

	@Post()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiBody({ type: createProjectDTO })
	async createProject(@Body() body: createProjectDTO, @Req() req: any) {
		return jsonResponse(await this.ProjectService.createProject(body, req.user.id), 'Project created', 200);
	}

	@Get()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	@ApiQuery({ name: 'keyword', type: String, required: false })
	async getListProject(
		@Query('page') page: number = 1,
		@Query('pageSize') pageSize: number = 10,
		@Query('keyword') keyword: string,
		@Req() req: any,
	) {
		const { data, pages } = await this.ProjectService.getListProject(page, pageSize, keyword, req.user.id);
		return jsonResponse(data, 'Project list', 200, pages);
	}

	@Get(':id/user')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	@ApiQuery({ name: 'keyword', type: String, required: false })
	@ApiQuery({ name: 'role', type: String, required: false })
	async getListUserInProject(@Param('id') id: string, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10, @Query('keyword') keyword: string, @Query('role') role: UserProjectRole, @Req() req: any) {
		return jsonResponse(await this.ProjectService.getListUserInProject(id, page, pageSize, req.user.id, keyword, role), 'Project user list', 200);
	}

	@Post(':id/user/:userId')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async addUserInProject(@Param('id') id: string, @Param('userId') userId: string, @Body() body: updateUserInProjectDTO, @Req() req: any) {
		return jsonResponse(await this.ProjectService.addUserInProject(id, userId, req.user.id, body.role), 'Project user added', 200);
	}
	
	@Patch(':id/user/:userId')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async updateUserInProject(@Param('id') id: string, @Param('userId') userId: string, @Body() body: updateUserInProjectDTO, @Req() req: any) {
		return jsonResponse(await this.ProjectService.updateUserInProject(id, userId, body, req.user.id), 'Project list', 200);
	}

	@Delete(':id/user/:userId')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async deleteUserInProject(@Param('id') id: string, @Param('userId') userId: string, @Req() req: any) {
		return jsonResponse(await this.ProjectService.deleteUserInProject(id, userId, req.user.id), 'Project list', 200);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getProject(@Param('id') id: string, @Req() req: any) {
		return jsonResponse(await this.ProjectService.getProject(id, req.user.id), 'Project', 200);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async updateProject(@Param('id') id: string, @Body() body: updateProjectDTO) {
		return jsonResponse(await this.ProjectService.updateProject(id, body), 'Project updated', 200);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async deleteProject(@Param('id') id: string, @Req() req: any) {
		return jsonResponse(await this.ProjectService.deleteProject(id, req.user.id), 'Project deleted', 200);
	}

	
}
