import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TokenModule } from '../token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './sessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), TokenModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
