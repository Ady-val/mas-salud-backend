import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '@common/entities/user-roles.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
