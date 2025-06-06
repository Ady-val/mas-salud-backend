import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@app/auth/auth.module';
import { MedicalSpecialist } from '@common/entities';
import { MedicalSpecialistsController } from './medical-specialist.controller';
import { MedicalSpecialistsService } from './medical-specialists.service';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalSpecialist]), AuthModule, CaslModule],
  controllers: [MedicalSpecialistsController],
  providers: [MedicalSpecialistsService],
})
export class MedicalSpecialistsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(MedicalSpecialistsController);
  }
}
