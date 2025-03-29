import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'app/auth/auth.module';
import { SessionGuard } from 'app/auth/guard/session.guard';
import { InstitutionsModule } from 'app/institutions/institutions.module';
import { UsersModule } from 'app/users/users.module';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';
import { AppDataSource } from 'data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    InstitutionsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
