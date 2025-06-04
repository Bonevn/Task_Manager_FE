import { Module } from '@nestjs/common';
import { ActivitysService } from './service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/auth.constants';
import { activityController } from './controller';

@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '1d' },
		}),
	],
	providers: [ActivitysService, PrismaService],
	exports: [ActivitysService],
	controllers: [activityController],
})
export class ActivityModule {}
