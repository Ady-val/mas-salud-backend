import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionsModule } from 'app/institutions/institutions.module';
import { UsersModule } from 'app/users/users.module';
import { AppDataSource } from 'data-source';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), InstitutionsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
