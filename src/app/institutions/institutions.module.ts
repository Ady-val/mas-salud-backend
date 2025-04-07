import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from '../../common/entities/institutions.entity';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';
import { AuthModule } from '../auth/auth.module';
import { CaslAbilityFactory } from 'app/auth/casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Institution]), AuthModule],
  controllers: [InstitutionsController],
  providers: [InstitutionsService, CaslAbilityFactory],
})
export class InstitutionsModule {}
