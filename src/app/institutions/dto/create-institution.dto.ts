import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty({
    example: 'Hospital General',
    description: 'Nombre único de la institución',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Hospital público de la ciudad',
    description: 'Descripción opcional',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
