import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalSpecialistDto } from './create-medical-specialists.dto';

export class UpdateMedicalSpecialistDto extends PartialType(CreateMedicalSpecialistDto) {}
