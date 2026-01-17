import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '@kacper2076/logger-client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (status >= 500) {
        this.logger.error('HTTP Exception', {
          status,
          message: exception.message,
          path: request.url,
          method: request.method,
        });
      } else {
        this.logger.warn('HTTP Exception', {
          status,
          message: exception.message,
          path: request.url,
          method: request.method,
        });
      }

      return response.status(status).json(exceptionResponse);
    }

    this.logger.error('Unhandled exception', {
      exception:
        exception instanceof Error
          ? {
              name: exception.name,
              message: exception.message,
              stack: exception.stack,
            }
          : exception,
      path: request.url,
      method: request.method,
    });

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
