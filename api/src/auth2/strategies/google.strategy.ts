import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { SignInGoogleDto } from '../dto/sign-in-google.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.validation';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', { infer: true }),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', { infer: true }),
      callbackURL: configService.get('GOOGLE_REDIRECT_URI', { infer: true }),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.authService.validateOAuthUser(
      profile._json as SignInGoogleDto,
    );
    done(null, user);
  }
}
