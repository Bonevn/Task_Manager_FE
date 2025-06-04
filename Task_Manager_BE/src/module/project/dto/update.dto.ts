import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserProjectRole } from '@prisma/client';

export class updateProjectDTO {
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
	key: string;
}

export class updateUserInProjectDTO {
	@ApiProperty()
	@IsEnum(UserProjectRole)
	@IsOptional()
	role: UserProjectRole;
}