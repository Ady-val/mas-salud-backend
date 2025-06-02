import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from '../../common/entities/institutions.entity';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';
import { AuthModule } from '../auth/auth.module';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Institution]), AuthModule, CaslModule],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
})
export class InstitutionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(InstitutionsController);
  }
}
