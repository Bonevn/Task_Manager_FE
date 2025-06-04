import { IsOptional, IsString, IsDate, IsEnum, IsBoolean } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class updateTaskDTO {
	@ApiProperty()
	@IsString()
	@IsOptional()
	name: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	description: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	parentId: string;

	@ApiProperty()
	@IsEnum(TaskPriority)
	@IsOptional()
	priority: TaskPriority;

	@ApiProperty()
	@IsEnum(TaskStatus)
	@IsOptional()
	status: TaskStatus;

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
