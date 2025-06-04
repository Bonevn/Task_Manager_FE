import { Module } from '@nestjs/common';
import { DashboardsService } from './service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { DashboardController } from './controller';
import { ProjectsService } from '../project/service';
import { UsersService } from '../users/users.service';

@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '1d' },
		}),
	],
	providers: [DashboardsService, PrismaService, ProjectsService, UsersService],
	exports: [DashboardsService],
	controllers: [DashboardController],
})
export class DashboardModule {}
