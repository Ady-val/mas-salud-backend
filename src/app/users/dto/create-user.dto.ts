import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'JPEREZ',
    description: 'Username (unique)',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'PasswordSeguro123',
    description: 'Password (mín 8, máx 50 caracteres)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'User name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Institution id',
    required: false,
  })
  @IsString()
  institutionId: string | null;

  @ApiProperty({
    description: 'Role id',
    required: false,
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
