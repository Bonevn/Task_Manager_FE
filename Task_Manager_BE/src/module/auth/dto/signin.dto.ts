import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class signInDto {
	@ApiProperty()
	@IsString()
	email: string;
	@ApiProperty()
	@IsString()
	password: string;
}
