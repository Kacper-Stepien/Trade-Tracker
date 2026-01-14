import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  // JWT Configuration
  @IsString()
  @MinLength(20, {
    message: 'JWT_SECRET must be at least 32 characters in production',
  })
  JWT_SECRET: string;

  @IsNumber()
  JWT_SALT: number;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '2d';

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '30d';

  // Google OAuth
  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID: string = '';

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_SECRET: string = '';

  @IsString()
  @IsOptional()
  GOOGLE_REDIRECT_URI: string =
    'http://localhost:3000/api/auth/google/callback';

  // Database Configuration
  @IsString()
  @IsNotEmpty()
  PGHOST: string;

  @IsString()
  @IsNotEmpty()
  PGUSER: string;

  @IsString()
  @IsNotEmpty()
  PGPASSWORD: string;

  @IsString()
  @IsNotEmpty()
  PGDATABASE: string;

  @IsNumber()
  PGPORT: number = 5432;

  @IsString()
  ENDPOINT_ID: string;

  // Application Configuration
  @IsNumber()
  @IsOptional()
  PASSWORD_MIN_LENGTH: number = 8;

  @IsString()
  @IsOptional()
  FRONTEND_URL: string = 'http://localhost:5173';

  @IsString()
  @IsOptional()
  LOGGER_URL: string = 'http://localhost:5000';

  @IsNumber()
  @IsOptional()
  API_PORT: number = 3000;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
