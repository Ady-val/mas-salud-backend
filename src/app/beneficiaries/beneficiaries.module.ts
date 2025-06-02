import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beneficiary } from '../../common/entities/beneficiaries.entity';
import { BeneficiariesController } from './beneficiaries.controller';
import { BeneficiariesService } from './beneficiaries.service';
import { AuthModule } from '@app/auth/auth.module';
import { SessionMiddleware } from '@common/middlewares/session.middleware';
import { CaslModule } from '@app/auth/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Beneficiary]), AuthModule, CaslModule],
  controllers: [BeneficiariesController],
  providers: [BeneficiariesService],
})
export class BeneficiariesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(BeneficiariesController);
  }
}
