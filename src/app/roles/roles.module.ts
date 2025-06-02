import { Permission } from '@common/entities/permissions.entity';
import { RolePermission } from '@common/entities/role-permission.entity';
import { Role } from '@common/entities/roles.entity';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { SessionModule } from '@app/auth/sessions/session.module';
import { TokenModule } from '@app/auth/token/token.module';
import { UserRole } from '@common/entities/user-roles.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole]),
    SessionModule,
    TokenModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(RolesController);
  }
}
