import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'nuevoemail@ejemplo.com',
    description: 'Nuevo email (opcional)',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'NuevaPassword123',
    description: 'Nueva contraseña (opcional)',
    required: false,
  })
  @MinLength(8)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'NuevoNombre',
    description: 'Nuevo nombre (opcional)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Nuevo id de institución (opcional)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  institutionId?: string | null;

  @ApiProperty({
    description: 'Nuevo id de rol (opcional)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  roleId?: string | undefined;
}
