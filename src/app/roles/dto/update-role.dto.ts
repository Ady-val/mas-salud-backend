import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionGroupDto } from './create-role.dto';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isGlobal?: boolean;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  permissions?: PermissionGroupDto[];
}
