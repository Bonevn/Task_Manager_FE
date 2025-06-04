import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDTO {
	@ApiProperty()
	@IsString()
	@IsOptional()
	name: string;
	@ApiProperty()
	@IsOptional()
	picture: string;
	@ApiProperty()
	@IsString()
	@IsOptional()
	bio: string;
	@ApiProperty()
	@IsString()
	@IsOptional()
	role: UserRole;
}
