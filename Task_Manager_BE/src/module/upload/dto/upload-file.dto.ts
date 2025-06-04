import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum MetadataType {
  TASK = 'TASK',
  USER = 'USER',
}

class MetadataDto {
  @ApiProperty({ description: 'Description of the file', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Type of the file', required: false })
  @IsOptional()
  @IsEnum(MetadataType)
  type?: MetadataType;

  @ApiProperty({ description: 'Description of the file', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;

  @ApiProperty({ type: 'object', required: false })
  @IsOptional()
  @IsObject()
  metadata?: MetadataDto;
} 

