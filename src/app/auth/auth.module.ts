import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { TokenModule } from './token/token.module';
import { SessionModule } from './sessions/session.module';
import { SessionGuard } from './guard/session.guard';
import { UsersModule } from 'app/users/users.module';
import { CaslAbilityFactory } from './casl/casl-ability.factory';

@Module({
  imports: [PasswordModule, TokenModule, SessionModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionGuard, SessionModule, TokenModule, CaslAbilityFactory],
  exports: [AuthService, SessionGuard, SessionModule, TokenModule, CaslAbilityFactory],
})
export class AuthModule {}
