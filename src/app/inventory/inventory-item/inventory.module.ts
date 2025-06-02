import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { InventoryItem, InventoryMovement } from '@common/entities';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';
@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, InventoryMovement]), AuthModule, CaslModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(InventoryController);
  }
}
