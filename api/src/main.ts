import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@kacper2076/logger-client';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.validation';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const startTime = Date.now();
  Logger.configure({
    apiUrl: process.env.LOGGER_URL,
    service: 'TradeTracker API',
  });
  const logger = new Logger('Main');
  logger.info('Starting TradeTracker API...', {
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
  });

  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new GlobalExceptionFilter());
    const configService = app.get(ConfigService<EnvironmentVariables, true>);
    const frontendUrl = configService.get('FRONTEND_URL', { infer: true });
    const port = configService.get('API_PORT', { infer: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    logger.info('Global validation pipe configured', {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    app.use(cookieParser());
    logger.info('Cookie parser enabled');

    app.enableCors({
      origin: frontendUrl,
      credentials: true,
    });
    logger.info('CORS enabled', { allowedOrigin: frontendUrl });

    const config = new DocumentBuilder()
      .setTitle('TradeTracker API Documentation')
      .setDescription('API for tracking trading products and costs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    logger.info('Swagger documentation available at /docs');

    app.setGlobalPrefix('api');

    await app.listen(port);

    const elapsedTime = Date.now() - startTime;
    logger.info('TradeTracker API started successfully', {
      port,
      environment: process.env.NODE_ENV || 'development',
      url: `http://localhost:${port}/api`,
      docs: `http://localhost:${port}/docs`,
      startupTime: `${elapsedTime}ms`,
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received - starting graceful shutdown...`);
      logger.warn(`${signal} signal received: closing HTTP server`);

      try {
        await app.close();
        console.log('Application closed');
        logger.info('HTTP server closed successfully');

        // Wait for logger to send the message
        await new Promise((resolve) => setTimeout(resolve, 100));
        console.log('Graceful shutdown complete');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    logger.error('Failed to start TradeTracker API', {
      error: errorMessage,
      stack: errorStack,
    });
    process.exit(1);
  }
}

bootstrap();
