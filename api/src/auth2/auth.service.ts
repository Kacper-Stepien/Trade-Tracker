import { AppConfigService } from './../config/config.service';
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
import { UserDto } from 'src/users/dtos/user-dto';
import { UserMapper } from 'src/users/user.mapper';
import { Response } from 'express';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: AppConfigService,
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
    const user = await this.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('INVALID_EMAIL_OR_PASSWORD');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { token: accessToken, user };
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    const existingUser = await this.usersService.findUserByEmail(
      signUpDto.email,
    );
    if (existingUser) {
      throw new ConflictException('USER_WITH_GIVEN_EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await this.hashPassword(signUpDto.password);
    return this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
      accountType: AccountType.LOCAL,
    });
  }

  async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwtSecret,
      expiresIn: this.configService.jwtExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.jwtRefreshSecret,
      expiresIn: this.configService.jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(
    req: any,
    res: Response,
  ): Promise<{ accessToken: string }> {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: this.configService.jwtRefreshSecret,
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
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response) {
    res.clearCookie('refreshToken', { path: '/' });
  }

  async validateOAuthUser(oAuthUser: SignInGoogleDto): Promise<User> {
    let user = await this.usersService.findUserByEmail(
      oAuthUser.email,
      AccountType.GOOGLE,
    );

    if (user) return user;

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

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
