import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './project/module';
import { TasksModule } from './task/module';
import { CommentsModule } from './task/comment/module';
import { DashboardModule } from './dashboard/module';
import { ActivityModule } from './activity/module';
@Module({
	imports: [
		AuthModule,
		UsersModule,
		ProjectsModule,
		TasksModule,
		CommentsModule,
		DashboardModule,
		ActivityModule,
		RouterModule.register([
			{
				path: '/api',
				children: [
					{
						path: '/auth',
						module: AuthModule,
					},
					{
						path: '/users',
						module: UsersModule,
					},
					{
						path: '/projects',
						module: ProjectsModule,
					},
					{
						path: '/tasks',
						module: TasksModule,
						children: [
							{
								path: '/comments',
								module: CommentsModule,
							},
						],
					},
					{
						path: '/dashboard',
						module: DashboardModule,
						children: [
							{
								path: '/activity',
								module: ActivityModule,
							},
						],
					},
				],
			},
		]),
	],
})
export class RoutersModule {}
