import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';
import { SessionGuard } from '@app/auth/guard/session.guard';
import { UserRequest } from '@common/interfaces/api-request.interface';

@Controller()
export class AppController {
  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

  @UseGuards(SessionGuard)
  @Get('me')
  getHello(@Req() req: UserRequest): any {
    const user = req.user;
    if (!user) {
      throw new Error('User not found');
    }

    const rules = this.caslAbilityFactory.getRulesForUser(user);

    return {
      username: user.username,
      institution: user.institution,
      permissions: rules,
    };
  }

  @Get('test')
  getTest(): any {
    return {
      message: 'Test endpoint',
    };
  }
}
