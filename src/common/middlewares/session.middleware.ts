import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { HTTP_MESSAGES } from '@common/constants/http-messages.constants';
import { SessionService } from '@app/auth/sessions/session.service';
import { TokenService } from '@app/auth/token/token.service';
import { UserRequest } from '@common/interfaces/api-request.interface';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly sessionService: SessionService,
    private readonly jwt: TokenService,
  ) {}

  private extractTokenFromHeader(req: UserRequest): string | null {
    let access_token: string | undefined;
    access_token = (req.cookies as Record<string, string | undefined>)?.['access_token'];

    if (!access_token && req.headers.authorization) {
      const authHeader = req.headers.authorization.split(' ');
      if (authHeader.length === 2 && authHeader[0] === 'Bearer') {
        access_token = authHeader[1];
      } else {
        return null;
      }
    }
    return access_token ?? null;
  }

  async use(req: UserRequest, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.NO_TOKEN_PROVIDED);
    }

    const session = await this.sessionService.checkSession(token);
    if (!session) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_SESSION);
    }

    const payload = this.jwt.verifyToken(token);
    if (!payload) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_TOKEN);
    }

    req.user = payload;

    next();
  }
}
