import { IsOptional, IsString, IsEnum, IsDate, IsBoolean } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class createCommentDTO {
	@ApiProperty()
	@IsString()
	content: string;

	@ApiProperty()
	@IsString()
	taskId: string;
}
