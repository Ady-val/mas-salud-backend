import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordModule } from 'app/auth/password/password.module';
import { TokenModule } from 'app/auth/token/token.module';
import { SessionModule } from 'app/auth/sessions/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PasswordModule, TokenModule, SessionModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
