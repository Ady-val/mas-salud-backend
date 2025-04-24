import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../common/entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthModule } from '@app/auth/auth.module';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';
import { SessionMiddleware } from '@common/middlewares/session.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, CaslAbilityFactory],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(ProductsController);
  }
}
