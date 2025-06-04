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
import { ActivitysService } from './service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import jsonResponse from 'src/utils/json_response';
import { RolesGuard } from '../auth/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/role.decorator';
import { CreateActivityDTO } from './dto/create.dto';
@Controller('')
@ApiTags('activity')
@Injectable()
export class activityController {
	constructor(private activityService: ActivitysService) {}


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
		const data = await this.activityService.getListLatestActivity(page, pageSize);
		return jsonResponse(data, 'Activity list', 200);
	}

	@Post()
	@ApiBearerAuth()
	@ApiBody({ type: CreateActivityDTO })
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	async createActivity(@Body() body: CreateActivityDTO, @Req() req: any) {
		const data = await this.activityService.createActivity(body.content, req.user.id);
		return jsonResponse(data, 'Activity created', 200);
	}
}
