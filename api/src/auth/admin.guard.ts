import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Role } from '../users/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have the necessary permissions to access this resource',
      );
    }
    return true;
  }
}
