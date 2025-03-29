import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../sessions/session.service';
import { HTTP_MESSAGES } from 'app/constants/http-messages.constants';
import { TokenService } from '../token/token.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly jwt: TokenService,
  ) {}

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.NO_TOKEN_PROVIDED);
    }

    const session = await this.sessionService.checkSession(token);

    if (!session) {
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_SESSION);
    }

    const payload = this.jwt.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_TOKEN);
    }

    const { iat: _iat, exp: _exp, ...rest } = payload;
    void _iat;
    void _exp;
    request['user'] = rest;

    return true;
  }
}
