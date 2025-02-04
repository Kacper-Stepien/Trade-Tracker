import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { Public } from './public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { UserDto } from '../users/dtos/user-dto';
import { SignInUnauthorizedResponseDto } from './dtos/sing-in-unauthorized-response.dto';
import { SignUpConflictResponseDto } from './dtos/sign-up-conflict-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: SignInUnauthorizedResponseDto,
  })
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created account',
    type: UserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: SignUpConflictResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto): Promise<UserDto> {
    return this.authService.signUp(signUpDto);
  }
}
