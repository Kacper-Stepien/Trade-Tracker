import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Role } from '../../users/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!this.hasAdminRole(user)) {
      throw new ForbiddenException(
        'You do not have the necessary permissions to access this resource.',
      );
    }
    return true;
  }

  private hasAdminRole(user: any): boolean {
    return user.role === Role.ADMIN;
  }
}
