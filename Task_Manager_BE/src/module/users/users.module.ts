import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { UserController } from './users.controller';
import { UploadModule } from '../upload/module';
import { UploadService } from '../upload/service';
@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
		}),
		UploadModule,
	],
	providers: [UsersService, PrismaService, UploadService],
	exports: [UsersService],
	controllers: [UserController],
})
export class UsersModule {}
