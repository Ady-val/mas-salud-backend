import { PartialType } from '@nestjs/mapped-types';
import { CreateInstitutionDto } from './create-institution.dto';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstitutionDto extends PartialType(CreateInstitutionDto) {
  @ApiProperty({
    example: 'Hospital General Renovado',
    description: 'Nuevo nombre de la institución (opcional)',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'Ahora con nuevas especialidades',
    description: 'Nueva descripción (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
