import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsUUID,
  IsNumberString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { SpecialistType } from '../enum/specialist.enum';

export class CreateMedicalSpecialistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumberString()
  @IsOptional()
  phone?: string;

  @IsEnum(SpecialistType)
  specialty: SpecialistType;

  @IsOptional()
  @IsString()
  professionalLicense?: string;

  @IsUUID()
  institutionId: string;
}
