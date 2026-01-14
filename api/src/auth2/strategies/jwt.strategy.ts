import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.validation';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return { sub: payload.sub, email: payload.email };
  }
}
