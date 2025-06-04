import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { MetadataType, UploadFileDto } from './dto/upload-file.dto';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class UploadService {
	private readonly uploadDir = 'uploads';

	constructor(private prisma: PrismaService) {
		if (!fs.existsSync(this.uploadDir)) {
			fs.mkdirSync(this.uploadDir, { recursive: true });
		}
	}
	async uploadFile(file: Express.Multer.File, userId: string, metadata: any,) {
		try {
			const uniqueFilename = `${Date.now()}-${file.originalname}`;
			const filePath = path.join(this.uploadDir, uniqueFilename);

			await fs.promises.writeFile(filePath, file.buffer);

			const createFile = await this.prisma.file.create({
				data: {
					name: file.originalname,
					url: `/uploads/${uniqueFilename}`,
					path: filePath,
					type: file.mimetype,
					size: file.size,
					userId: userId,
					metadata: metadata,
				},
				include: {
					user: {
						select: {
							name: true,
						},
					},
				},
			});

			return createFile;
		} catch (error) {
			throw new HttpException(
				'Failed to upload file',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getFile(id: string) {
		const file = await this.prisma.file.findUnique({ where: { id } });
		if (!file) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
		const filePath = path.join(file.path);
		const stream = fs.createReadStream(filePath);
		return {
			stream,
			name: file.name,
			type: file.type,
			size: file.size,
		};
	}

	async getImage(filepath: string) {
		const findFile = await this.prisma.file.findFirst({ where: { url: filepath } });
		if (!findFile) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
		if (findFile.type !== 'image/jpeg' && findFile.type !== 'image/png' && findFile.type !== 'image/jpg') {
			throw new HttpException('File is not an image', HttpStatus.BAD_REQUEST);
		}
		const filePath = path.join(findFile.path);
		const stream = fs.createReadStream(filePath);
		return {
			stream,
			name: findFile.name,
			type: findFile.type,
			size: findFile.size,
		};
	}

	async getListFile(page: number, pageSize: number, keyword: string) {
		const files = await this.prisma.file.findMany({
			where: {
				name: { contains: keyword },
			},
			skip: (page - 1) * pageSize,
		});
		return files;
	}
}
