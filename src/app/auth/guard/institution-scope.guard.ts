import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@common/enum/role.enum';
import { UserRequest } from '@common/interfaces/api-request.interface';

@Injectable()
export class InstitutionScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    if (user.role?.includes(Role.ADMIN)) {
      return true;
    }

    console.log('User:', user.institutionId);
    console.log('Request:', request);

    request.query['institutionId'] = user.institutionId;

    return true;
  }
}
