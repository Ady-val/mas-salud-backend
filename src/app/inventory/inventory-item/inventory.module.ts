import { Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { InventoryItem, InventoryMovement } from '@common/entities';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, InventoryMovement]), AuthModule],
  controllers: [InventoryController],
  providers: [InventoryService, CaslAbilityFactory],
  exports: [InventoryService],
})
export class InventoryModule {}
