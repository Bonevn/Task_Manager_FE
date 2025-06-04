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
import { TaskOrderBy, TasksService } from './service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import jsonResponse from 'src/utils/json_response';
import { createTaskDTO } from './dto/create.dto';
import { updateTaskDTO } from './dto/update.dto';
import { TaskStatus } from '@prisma/client';
import { TaskPriority } from '@prisma/client';
@Controller('')
@ApiTags('Task')
@Injectable()
export class TaskController {
	constructor(private TaskService: TasksService) {}

	@Post()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiBody({ type: createTaskDTO })
	async createTask(@Body() body: createTaskDTO, @Req() req: any) {
		return jsonResponse(await this.TaskService.createTask(body, req.user.id), 'Task created', 200);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async getTask(@Param('id') id: string) {
		return jsonResponse(await this.TaskService.getTask(id), 'Task', 200);
	}

	// @ decorator bản chất nó sẽ là một functinon ẩn bổ sung vào hàm getListTask
	//  bổ chắc năng mà không ảnh hưởng đến hàm chính gốc của code
	// Những cái liên quan đến @API xyz là những thông tin cần thiết để hiển thị trong swagger
	@Get()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	@ApiQuery({ name: 'status', type: String, required: false })
	@ApiQuery({ name: 'priority', type: String, required: false })
	@ApiQuery({ name: 'name', type: String, required: false })
	@ApiQuery({ name: 'projectId', type: String, required: false })
	@ApiQuery({ name: 'assigneeId', type: String, required: false })
	@ApiQuery({ name: 'orderBy', type: String, required: false })
	@ApiQuery({ name: 'orderDirection', type: String, required: false })
	@ApiQuery({ name: 'excludeDone', type: Boolean, required: false })
	async getListTask(
		@Query('page') page: number = 1,
		@Query('pageSize') pageSize: number = 10,
		@Query('status') status: TaskStatus,
		@Query('priority') priority: TaskPriority,
		@Query('name') name: string,
		@Query('projectId') projectId: string,
		@Query('assigneeId') assigneeId: string,
		@Query('excludeDone') excludeDone: boolean = false,
		@Query('orderBy') orderBy: TaskOrderBy = TaskOrderBy.CREATED_AT,
		@Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
	) {
		const { data, pages } = await this.TaskService.getTasks(
			projectId,
			page,
			pageSize,
			name,
			assigneeId,
			orderBy,
			orderDirection,
			status,
			priority,
			excludeDone,
		);
		return jsonResponse(data, 'Task list', 200, pages);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async updateTask(@Param('id') id: string, @Body() body: updateTaskDTO, @Req() req: any) {
		return jsonResponse(await this.TaskService.updateTask(id, body, req.user.id), 'Task updated', 200);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async deleteTask(@Param('id') id: string) {
		return jsonResponse(await this.TaskService.deleteTask(id), 'Task deleted', 200);
	}
}
