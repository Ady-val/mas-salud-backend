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
import { AppController } from 'app.controller';
import { InventoryModule } from 'app/inventory/inventory-item/inventory.module';
import { InventoryMovementModule } from 'app/inventory/inventory-movements/inventory-movement.module';
import { MedicalSpecialistsModule } from 'app/medical-specialists/medical-specialists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    InstitutionsModule,
    BeneficiariesModule,
    ProductsModule,
    InventoryModule,
    InventoryMovementModule,
    MedicalSpecialistsModule,
  ],
  controllers: [AppController],
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
