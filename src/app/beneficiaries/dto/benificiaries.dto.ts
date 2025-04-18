import { Expose, Type } from 'class-transformer';
import { Beneficiary } from '../../../common/entities/beneficiaries.entity';

export class ResponseBeneficiariesDto {
  @Expose()
  count: number;

  @Expose()
  totalPages: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => Beneficiary)
  data: Beneficiary[];
}
