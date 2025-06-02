import { IsArray, IsBoolean, IsString, IsUUID } from 'class-validator';
import { PermissionGroupDto } from './create-role.dto';

export class RoleResponseDto {
  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isGlobal: boolean;

  @IsArray()
  permissions: PermissionGroupDto[];
}
