import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDTO } from '@common/dto/paginated-response.dto';
import { MedicalSpecialist } from '@common/entities';

export class ResponseedicalSpecialistsDto extends PaginatedResponseDTO {
  @Expose()
  @Type(() => MedicalSpecialist)
  data: MedicalSpecialist[];
}
