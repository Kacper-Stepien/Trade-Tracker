import { Injectable } from '@nestjs/common';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService');

  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  getInfo() {
    this.logger.info('API info requested');
    return {
      name: 'TradeTracker API',
      version: '1.0.0',
      description: 'API for tracking trading products and costs',
      documentation: '/docs',
      health: '/health',
    };
  }
}
