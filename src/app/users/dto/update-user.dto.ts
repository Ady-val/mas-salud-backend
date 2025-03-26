import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'nuevoemail@ejemplo.com',
    description: 'Nuevo email (opcional)',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'NuevaPassword123',
    description: 'Nueva contraseña (opcional)',
    required: false,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @IsOptional()
  password?: string;
}
