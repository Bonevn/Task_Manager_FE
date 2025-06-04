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
	UseGuards,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	HttpException,
	HttpStatus,
	StreamableFile,
	Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import jsonResponse from 'src/utils/json_response';
import { UploadService } from './service';
import { UploadFileDto } from './dto/upload-file.dto';
import { Response } from 'express';

@Controller('upload')
@ApiTags('Upload')
@Injectable()
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('file')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
					new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|pdf|doc|docx|csv)$/ }),
				],
				fileIsRequired: true,
			}),
		)
		file: Express.Multer.File,
		@Req() req: any,
		@Body() body: any,
	) {
		if (!file) {
			throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
		}

		let metadata = body.metadata;
		if (metadata) {
			try {
				if (typeof metadata === 'string') {
					metadata = JSON.parse(metadata);
				}
			} catch (error) {
				throw new HttpException('Invalid metadata format: ' + error, HttpStatus.BAD_REQUEST);
			}
		}

		const uploadFile = await this.uploadService.uploadFile(file, req.user.id, metadata);
		return jsonResponse(uploadFile, 'File uploaded successfully', 200);
	}

	@Get('list')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'pageSize', type: Number, required: false })
	@ApiQuery({ name: 'keyword', type: String, required: false })
	async getListFile(
		@Query('page') page: number = 1,
		@Query('pageSize') pageSize: number = 10,
		@Query('keyword') keyword: string,
	) {
		return jsonResponse(
			await this.uploadService.getListFile(page, pageSize, keyword),
			'File list',
			200,
		);
	}

	@Get('image/:filepath')
	async getImage(@Param('filepath') filepath: string, @Res() res: Response) {
		if (filepath.includes('..')) {
			throw new HttpException('Invalid filepath', HttpStatus.BAD_REQUEST);
		}
		const file = await this.uploadService.getImage(filepath);
		res.set({
			'Content-Type': file.type,
			'Content-Disposition': `inline; filename="${file.name}"`,
			'Content-Length': file.size,
		});
		return file.stream.pipe(res);
	}

	@Get(':id')
	async getFile(@Param('id') id: string, @Res() res: Response) {
		const file = await this.uploadService.getFile(id);
		res.set({
			'Content-Type': file.type,
			'Content-Disposition': `attachment; filename="${file.name}"`,
			'Content-Length': file.size,
		});
		return file.stream.pipe(res);
	}
}
