import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beneficiary } from '../../common/entities/beneficiaries.entity';
import { BeneficiariesController } from './beneficiaries.controller';
import { CaslAbilityFactory } from '@app/auth/casl/casl-ability.factory';
import { BeneficiariesService } from './beneficiaries.service';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Beneficiary]), AuthModule],
  controllers: [BeneficiariesController],
  providers: [BeneficiariesService, CaslAbilityFactory],
})
export class BeneficiariesModule {}
