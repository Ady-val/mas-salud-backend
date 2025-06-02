import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../common/entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthModule } from '@app/auth/auth.module';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, CaslModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(ProductsController);
  }
}
