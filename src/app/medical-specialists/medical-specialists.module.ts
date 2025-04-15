import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'app/auth/auth.module';
import { MedicalSpecialist } from 'common/entities';
import { MedicalSpecialistsController } from './medical-specialist.controller';
import { MedicalSpecialistsService } from './medical-specialists.service';
import { CaslAbilityFactory } from 'app/auth/casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalSpecialist]), AuthModule],
  controllers: [MedicalSpecialistsController],
  providers: [MedicalSpecialistsService, CaslAbilityFactory],
})
export class MedicalSpecialistsModule {}
