import { Request } from 'express';
import { User } from 'src/users/user.entity';

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface GoogleAuthenticatedRequest extends Request {
  user: User;
}
