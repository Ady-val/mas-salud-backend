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

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumberString()
  phone?: string;

  @IsEnum(SpecialistType)
  speciality: SpecialistType;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsUUID()
  institutionId: string;
}
