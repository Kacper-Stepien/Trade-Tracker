import { AppConfigService } from './../config/config.service';
import { SignInGoogleDto } from './dto/sign-in-google.dto';
import {
  ConflictException,
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

@Injectable()
export class AuthService {
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
      return null;
    }
    return UserMapper.toDto(user);
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.generateToken(user.id, user.email);
    return { token, user };
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    const existingUser = await this.usersService.findUserByEmail(
      signUpDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(signUpDto.password);
    return this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
      accountType: AccountType.LOCAL,
    });
  }

  async generateToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.jwtSecret,
      expiresIn: this.configService.jwtExpiresIn,
    });
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
