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
} from '@nestjs/common';
import { DashboardsService } from './service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import jsonResponse from 'src/utils/json_response';
import { RolesGuard } from '../auth/role.guard';
import { UserProjectRole, UserRole } from '@prisma/client';
import { Roles } from '../auth/role.decorator';
import { Req } from '@nestjs/common';
import { ProjectsService } from '../project/service';
@Controller('')
@ApiTags('dashboard')
@Injectable()
export class DashboardController {
	constructor(private dashboardService: DashboardsService, private projectService: ProjectsService) {}


	@Get()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	async getListLatestActivity(
		@Query('page') page: number = 1,
		@Query('pageSize') pageSize: number = 10,
	) {
		const data = await this.dashboardService.getListLatestActivity(page, pageSize);
		return jsonResponse(data, 'dashboard list', 200);
	}

	@Get('pie-chart')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	async getCountTaskByStatus(@Req() req: any) {
		const data = await this.dashboardService.getCountTaskByStatus(req.user.id);
		return jsonResponse(data, 'Count task by status', 200);
	}

	@Get('list-project')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	@ApiQuery({ name: 'keyword', type: String, required: false })
	async getListProject(@Req() req: any, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10, @Query('keyword') keyword: string) {
		const data = await this.projectService.getProjectListByUser(req.user.id, page, pageSize, keyword);
		return jsonResponse(data, 'List project', 200);
	}

	@Get('count-task-by-project')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getCountTaskWhereUserIsOwnerAndAdmin(@Req() req: any) {
		const data = await this.dashboardService.getCountTaskByProjectAndStatus(req.user.id);
		return jsonResponse(data, 'Count task where user is owner and admin', 200);
	}
}
