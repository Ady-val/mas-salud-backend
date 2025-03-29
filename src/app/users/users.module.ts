import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordModule } from 'app/auth/password/password.module';
import { TokenModule } from 'app/auth/token/token.module';
import { SessionModule } from 'app/auth/sessions/session.module';
import { CaslAbilityFactory } from 'app/auth/casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PasswordModule, TokenModule, SessionModule],
  controllers: [UsersController],
  providers: [UsersService, CaslAbilityFactory],
  exports: [UsersService],
})
export class UsersModule {}
