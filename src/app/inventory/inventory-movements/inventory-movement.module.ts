import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@app/auth/auth.module';
import { InventoryItem, InventoryMovement } from '@common/entities';
import { InventoryMovementController } from './inventory-movement.controller';
import { InventoryMovementService } from './inventory-movement.service';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement, InventoryItem]), AuthModule, CaslModule],
  controllers: [InventoryMovementController],
  providers: [InventoryMovementService],
  exports: [InventoryMovementService],
})
export class InventoryMovementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(InventoryMovementController);
  }
}
