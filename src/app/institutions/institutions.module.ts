import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from './institutions.entity';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';
import { AuthModule } from 'app/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Institution]), AuthModule],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
})
export class InstitutionsModule {}
