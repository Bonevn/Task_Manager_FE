import { Module } from '@nestjs/common';
import { TasksService } from './service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { TaskController } from './controller';
import { UsersService } from '../users/users.service';
@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
		}),
	],
	providers: [TasksService, PrismaService, UsersService],
	exports: [TasksService],
	controllers: [TaskController],
})
export class TasksModule {}
