import { Action } from '@common/enum/action.enum';
import { Modules } from '@common/enum/modules.enum';
import { IsBoolean, IsString, IsArray, IsEnum } from 'class-validator';

export class PermissionGroupDto {
  @IsEnum(Modules)
  module: Modules;

  @IsArray()
  @IsEnum(Action, { each: true })
  actions: Action[];

  @IsBoolean()
  isGlobal?: boolean;
}

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsBoolean()
  isGlobal: boolean;

  @IsArray()
  permissions: PermissionGroupDto[];
}
