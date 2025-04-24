import { Role } from '@common/enum/role.enum';
import { UserRequest } from '@common/interfaces/api-request.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ScopedInstitutionId = createParamDecorator((_: void, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<UserRequest>();
  const user = req.user;
  if (!user?.role?.includes(Role.ADMIN)) {
    return user.institutionId;
  }
  return req.query.institutionId;
});
