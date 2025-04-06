import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateBeneficiaryDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'ID de la persona beneficiaria',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre de la persona beneficiaria',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Primer apellido de la persona beneficiaria',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: 'García',
    description: 'Segundo apellido de la persona beneficiaria',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  secondLastName: string;

  @ApiProperty({
    example: 'Masculino',
    description: 'Género de la persona beneficiaria',
    required: true,
    enum: ['Male', 'Female'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Male', 'Female'], { message: 'Gender must be either Male or Female' })
  gender: 'Male' | 'Female';

  @ApiProperty({
    example: 'PEPG800101HDFRJN07',
    description: 'CURP de la persona beneficiaria',
    required: true,
    maxLength: 18,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  curp: string;

  @ApiProperty({
    example: '5555555555',
    description: 'Teléfono de la persona beneficiaria',
    required: true,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsNumberString()
  phone: string;

  @ApiProperty({
    example: 'Calle Falsa',
    description: 'Calle de la persona beneficiaria',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: '123',
    description: 'Número exterior de la persona beneficiaria',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  externalNumber: string;

  @ApiProperty({
    example: '456',
    description: 'Número interior de la persona beneficiaria',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  internalNumber?: string;

  @ApiProperty({
    example: 'Colonia Centro',
    description: 'Colonia de la persona beneficiaria',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  colony: string;

  @ApiProperty({
    example: '12345',
    description: 'Código postal de la persona beneficiaria',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  postalCode: string;
}
