import { Module } from '@nestjs/common';
import { UploadService } from './service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { UploadController } from './controller';
@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
		}),
	],
	providers: [UploadService, PrismaService],
	exports: [UploadService],
	controllers: [UploadController],
})
export class UploadModule {}
