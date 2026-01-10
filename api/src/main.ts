import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppConfigService } from './config/config.service';
import { Logger } from '@kacper2076/logger-client';

async function bootstrap() {
  Logger.configure({
    apiUrl: process.env.LOGGER_URL,
    service: 'TradeTracker API',
  });
  const logger = new Logger('AuthService');

  logger.info('APP STARTED');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  const frontendUrl = configService.frontendUrl;
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('TradeTracker API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
