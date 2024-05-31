import { SignInDto } from './dtos/sign-in.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserDto } from '../users/dtos/user-dto';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    accessToken: string;
    user: UserDto;
  }> {
    const user = await this.usersService.findUserByEmail(signInDto.email);

    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: UserMapper.toDto(user),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(
      signUpDto.password,
      jwtConstants.salt,
    );
    const user = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    return user;
  }
}
