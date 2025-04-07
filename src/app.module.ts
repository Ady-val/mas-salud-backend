import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { InstitutionsModule } from './app/institutions/institutions.module';
import { UsersModule } from './app/users/users.module';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';
import { AppDataSource } from 'data-source';
import { CaslAbilityFactory } from 'app/auth/casl/casl-ability.factory';
import { BeneficiariesModule } from 'app/beneficiaries/beneficiaries.module';
import { ProductsModule } from 'app/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    InstitutionsModule,
    BeneficiariesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    AuthModule,
    CaslAbilityFactory,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
