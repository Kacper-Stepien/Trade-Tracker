import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleAuthenticatedRequest } from './auth-request.interface';
import { Public } from './public.decorator';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.validation';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const user = await this.authService.signUp(signUpDto);
    return res.status(201).json(user);
  }

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: SignInResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: SignInDto })
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { token, user } = await this.authService.signIn(signInDto, res);
    return res.json({ token, user });
  }

  @Get('google/login')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Start Google OAuth login process' })
  @ApiResponse({ status: 200, description: 'Redirects to Google OAuth login' })
  async googleAuth() {
    return { msg: 'google auth' };
  }

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Handle Google OAuth redirect and authenticate user',
  })
  @ApiResponse({
    status: 200,
    type: SignInResponseDto,
  })
  async googleAuthRedirect(
    @Req() req: GoogleAuthenticatedRequest,
    @Res() res: Response,
  ) {
    const user = req.user;
    await this.authService.signInGoogle(user, res);

    return res.redirect(
      this.configService.get('FRONTEND_URL', { infer: true }),
    );
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'New access token' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.refreshToken(req, res);
    return res.json({ token: accessToken });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out' })
  async logout(@Res() res: Response) {
    await this.authService.logout(res);
    return res.json({ message: 'Logged out successfully' });
  }
}
