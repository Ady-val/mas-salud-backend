import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'app/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  generateAccessToken(user: User): string {
    const payload = {
      username: user.username,
      sub: user.id,
      institutionId: user.institutionId,
      role: user.role,
      isAdmin: user.isAdmin,
    };
    return this.jwt.sign(payload);
  }

  verifyToken(token: string): TokenPayloadDto {
    try {
      const decoded = this.jwt.verify<TokenPayloadDto>(token, {
        secret: 'secretKey',
      });
      return decoded;
    } catch {
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_TOKEN);
    }
  }

  validateToken(token: string): boolean {
    try {
      this.jwt.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
