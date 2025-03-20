import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstitutionsModule } from './institutions/institutions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [InstitutionsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
