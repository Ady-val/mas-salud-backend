import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@app/auth/auth.module';
import { InventoryItem, InventoryMovement } from '@common/entities';
import { InventoryMovementController } from './inventory-movement.controller';
import { InventoryMovementService } from './inventory-movement.service';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement, InventoryItem]), AuthModule],
  controllers: [InventoryMovementController],
  providers: [InventoryMovementService, CaslAbilityFactory],
  exports: [InventoryMovementService],
})
export class InventoryMovementModule {}
