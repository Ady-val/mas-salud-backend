import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionsModule } from 'app/institutions/institutions.module';
import { UsersModule } from 'app/users/users.module';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';
import { AppDataSource } from 'data-source';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), InstitutionsModule, UsersModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
