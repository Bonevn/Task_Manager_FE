import { NestFactory } from '@nestjs/core';
// import { AppModule } from './routes/app/app.module';
import { RoutersModule } from './module/router';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import config_env from './config';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(RoutersModule);
	const config = new DocumentBuilder()
		.setTitle('Jira Clone API')
		.setDescription('Jira Clone API')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(config_env.SWAGGER_ENDPOINT, app, document);

	await app.listen(config_env.PORT);
	console.log(`Application is running on: ${await app.getUrl()}`);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
