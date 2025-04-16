import { CreateMedicalSpecialistDto } from './create-medical-specialists.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateMedicalSpecialistDto extends CreateMedicalSpecialistDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
