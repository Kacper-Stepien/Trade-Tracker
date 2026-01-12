import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

@Injectable()
export class AppConfigService {
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  get jwtSalt(): number {
    return this.configService.get('JWT_SALT', { infer: true });
  }

  get jwtExpiresIn(): string {
    return this.configService.get('JWT_EXPIRES_IN', { infer: true });
  }

  get jwtRefreshSecret(): string {
    return this.configService.get('JWT_REFRESH_SECRET', { infer: true });
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get('JWT_REFRESH_EXPIRES_IN', { infer: true });
  }

  get googleClientId(): string {
    return this.configService.get('GOOGLE_CLIENT_ID', { infer: true });
  }

  get googleClientSecret(): string {
    return this.configService.get('GOOGLE_CLIENT_SECRET', { infer: true });
  }

  get googleRedirectUri(): string {
    return this.configService.get('GOOGLE_REDIRECT_URI', { infer: true });
  }

  get databaseHost(): string {
    return this.configService.get('PGHOST', { infer: true });
  }

  get databaseUser(): string {
    return this.configService.get('PGUSER', { infer: true });
  }

  get databasePassword(): string {
    return this.configService.get('PGPASSWORD', { infer: true });
  }

  get databaseName(): string {
    return this.configService.get('PGDATABASE', { infer: true });
  }

  get databasePort(): number {
    return this.configService.get('PGPORT', { infer: true });
  }

  get endpointId(): string {
    return this.configService.get('ENDPOINT_ID', { infer: true });
  }

  get passwordMinLength(): number {
    return this.configService.get('PASSWORD_MIN_LENGTH', { infer: true });
  }

  get frontendUrl(): string {
    return this.configService.get('FRONTEND_URL', { infer: true });
  }

  get loggerUrl(): string {
    return this.configService.get('LOGGER_URL', { infer: true });
  }

  get apiPort(): number {
    return this.configService.get('API_PORT', { infer: true });
  }
}
