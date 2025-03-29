import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBeneficiaryDto {
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
    example: '12345',
    description: 'Código postal de la persona beneficiaria',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  postalCode: string;
}
