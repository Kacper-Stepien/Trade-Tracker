import { SignInDto } from './dtos/sign-in.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserDto } from '../users/dtos/user-dto';
import { UserMapper } from '../users/user.mapper';
import { SignInResponseDto } from './dtos/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.usersService.findUserByEmail(signInDto.email);

    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(user.id, user.email);
    return {
      token,
      user: UserMapper.toDto(user),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    const hashedPassword = await this.hashPassword(signUpDto.password);
    const user = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    return user;
  }

  private async generateToken(
    userId: number,
    username: string,
  ): Promise<string> {
    const payload = { sub: userId, username };
    return this.jwtService.signAsync(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, jwtConstants.salt);
  }
}
