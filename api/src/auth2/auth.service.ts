import { SignInGoogleDto } from './dto/sign-in-google.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AccountType } from 'src/users/account-type.enum';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { UserMapper } from 'src/users/user.mapper';
import { Response, Request } from 'express';
import { Logger } from '@kacper2076/logger-client';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.validation';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findUserByEmail(
      email,
      AccountType.LOCAL,
    );
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.error('User data not valid', { email });
      return null;
    }
    this.logger.info('User data valid', { email });
    return UserMapper.toDto(user);
  }

  async signIn(
    signInDto: SignInDto,
    res: Response,
  ): Promise<SignInResponseDto> {
    this.logger.info('User attempting to sign in', { email: signInDto.email });
    const user = await this.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      this.logger.warn('Sign in failed - invalid credentials', {
        email: signInDto.email,
      });
      throw new UnauthorizedException('INVALID_EMAIL_OR_PASSWORD');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:
        this.configService.get('NODE_ENV', { infer: true }) === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.getCookieMaxAge(),
    });

    this.logger.info('User signed in successfully', {
      userId: user.id,
      email: user.email,
    });
    return { token: accessToken, user };
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    this.logger.info('User attempting to sign up', { email: signUpDto.email });
    const existingUser = await this.usersService.findUserByEmail(
      signUpDto.email,
    );
    if (existingUser) {
      this.logger.warn('Sign up failed - user already exists', {
        email: signUpDto.email,
      });
      throw new ConflictException('USER_WITH_GIVEN_EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await this.hashPassword(signUpDto.password);
    const newUser = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
      accountType: AccountType.LOCAL,
    });

    this.logger.info('User signed up successfully', {
      userId: newUser.id,
      email: newUser.email,
    });
    return newUser;
  }

  async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET', { infer: true }),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', { infer: true }),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET', { infer: true }),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', {
        infer: true,
      }),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string }> {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      this.logger.warn('Refresh token failed - no token provided');
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET', { infer: true }),
      });

      const user = await this.usersService.findUserById(payload.sub);
      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const { accessToken, refreshToken } = await this.generateTokens(
        user.id,
        user.email,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure:
          this.configService.get('NODE_ENV', { infer: true }) === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: this.getCookieMaxAge(),
      });

      this.logger.info('Token refreshed successfully', {
        userId: user.id,
        email: user.email,
      });
      return { accessToken };
    } catch (error) {
      this.logger.error('Refresh token validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response) {
    this.logger.info('User logged out');
    res.clearCookie('refreshToken', { path: '/' });
  }

  async validateOAuthUser(oAuthUser: SignInGoogleDto): Promise<User> {
    this.logger.info('User attempting Google OAuth login', {
      email: oAuthUser.email,
    });

    let user = await this.usersService.findUserByEmail(
      oAuthUser.email,
      AccountType.GOOGLE,
    );

    if (user) {
      this.logger.info('Google OAuth user found', {
        userId: user.id,
        email: user.email,
      });
      return user;
    }

    this.logger.info('Creating new Google OAuth user', {
      email: oAuthUser.email,
    });

    await this.usersService.createUser({
      email: oAuthUser.email,
      name: oAuthUser.given_name,
      surname: oAuthUser.family_name,
      password: '',
      dateOfBirth: new Date('1900-01-01'),
      isProfessional: false,
      googleId: oAuthUser.sub,
      accountType: AccountType.GOOGLE,
    });

    user = await this.usersService.findUserByEmail(
      oAuthUser.email,
      AccountType.GOOGLE,
    );

    this.logger.info('Google OAuth user created successfully', {
      userId: user.id,
      email: user.email,
    });
    return user;
  }

  async signInGoogle(
    user: User,
    res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.info('Google OAuth sign in', {
      userId: user.id,
      email: user.email,
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:
        this.configService.get('NODE_ENV', { infer: true }) === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.getCookieMaxAge(),
    });

    return { accessToken, refreshToken };
  }

  public getCookieMaxAge(): number {
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', {
      infer: true,
    });
    const days = parseInt(expiresIn);
    return days * 24 * 60 * 60 * 1000;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get('JWT_SALT', { infer: true });
    return bcrypt.hash(password, saltRounds);
  }
}
