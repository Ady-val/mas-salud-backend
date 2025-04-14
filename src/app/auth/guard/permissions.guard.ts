import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';
import { UserRequest } from 'common/interfaces/api-request.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler());
    if (!rules) {
      return true;
    }

    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    const ability = this.caslAbilityFactory.createForUser(user);

    for (const rule of rules) {
      if (!ability.can(rule.action, rule.subject)) {
        throw new ForbiddenException('Access Denied');
      }
    }

    return true;
  }
}
