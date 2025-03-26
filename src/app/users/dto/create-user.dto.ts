import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email del usuario (único)',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'PasswordSeguro123',
    description: 'Contraseña (mín 8, máx 50 caracteres)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @ApiProperty({
    example: 'Admin',
    description: 'Rol del usuario',
    required: false,
    enum: ['Admin', 'User', 'Editor'],
  })
  @IsString()
  @IsOptional()
  role?: string;
}
