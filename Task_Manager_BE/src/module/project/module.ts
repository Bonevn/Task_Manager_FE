import { Module } from '@nestjs/common';
import { ProjectsService } from './service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { ProjectController } from './controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
		}),
		UsersModule,
	],
	providers: [ProjectsService, PrismaService, UsersService],
	exports: [ProjectsService],
	controllers: [ProjectController],
})
export class ProjectsModule {}
