import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordModule } from '@app/auth/password/password.module';
import { TokenModule } from '@app/auth/token/token.module';
import { SessionModule } from '@app/auth/sessions/session.module';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';
import { UserRole } from '@common/entities/user-roles.entity';
import { RolesModule } from '@app/roles/roles.module';
import { Institution } from '@common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Institution]),
    PasswordModule,
    TokenModule,
    SessionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesModule, CaslAbilityFactory],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
