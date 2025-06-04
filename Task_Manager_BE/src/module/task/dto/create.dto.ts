import { IsOptional, IsString, IsEnum, IsDate, IsBoolean } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class createTaskDTO {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	@IsEnum(TaskPriority)
	priority: TaskPriority;

	@ApiProperty()
	@IsOptional()
	@IsEnum(TaskStatus)
	status: TaskStatus;

	@ApiProperty()
	@IsString()
	projectId: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	parentId: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	assigneeId: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	reporterId: string;

	@ApiProperty()
	@Type(() => Date)
	@IsDate()
	@IsOptional()
	dueDate: Date;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	selected: boolean;
}
