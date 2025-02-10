import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'default_secret');
  }

  get jwtSalt(): number {
    return parseInt(this.configService.get<string>('JWT_SALT', '12'));
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '2d');
  }

  get googleClientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID', '');
  }

  get googleClientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET', '');
  }

  get googleRedirectUri(): string {
    return this.configService.get<string>(
      'GOOGLE_REDIRECT_URI',
      'http://localhost:3000/auth/google/callback',
    );
  }

  get databaseHost(): string {
    return this.configService.get<string>('PGHOST', '');
  }

  get databaseUser(): string {
    return this.configService.get<string>('PGUSER', '');
  }

  get databasePassword(): string {
    return this.configService.get<string>('PGPASSWORD', '');
  }

  get databaseName(): string {
    return this.configService.get<string>('PGDATABASE', '');
  }

  get databasePort(): number {
    return this.configService.get<number>('PGPORT', 10);
  }

  get endpointId(): string {
    return this.configService.get<string>('ENDPOINT_ID', '');
  }

  get passwordMinLength(): number {
    return parseInt(this.configService.get<string>('PASSWORD_MIN_LENGTH', '8'));
  }
}
