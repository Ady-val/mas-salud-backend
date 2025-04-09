import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'app/auth/guard/session.guard';
import { Request } from 'express';

@UseGuards(SessionGuard)
@Controller()
export class AppController {
  constructor() {}

  @Get('me')
  getHello(@Req() request: Request): string {
    const user = request['user'] as { username?: string } | undefined;
    if (user && typeof user.username === 'string') {
      return user.username;
    }
    throw new Error('User or username not found');
  }
}
