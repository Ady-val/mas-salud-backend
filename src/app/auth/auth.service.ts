import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { LoginDto } from './dto/login.dto';
import { PasswordService } from './password/password.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { SessionService } from './sessions/session.service';
import { HTTP_MESSAGES } from '@common/constants/http-messages.constants';
import { CaslAbilityFactory } from './casl/casl-ability.factory';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.passwordService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(HTTP_MESSAGES.CLIENT_ERROR.INVALID_CREDENTIALS);
    }

    const { token: accessToken } = await this.sessionService.createSession(user);

    const rules = this.caslAbilityFactory.getRulesForUser({
      username: user.username,
      sub: user.id,
      institutionId: user.institutionId ?? '',
      institution: user.institution?.name ?? '',
      role: user.role ?? [],
      isAdmin: user.isAdmin,
    });

    return {
      accessToken,
      username: user.username,
      institution: user.institution?.name ?? '',
      name: user.name,
      rules,
    };
  }

  async logout(token: string): Promise<void> {
    await this.sessionService.closeSession(token);
  }
}
