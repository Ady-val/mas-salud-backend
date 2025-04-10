import { Expose } from 'class-transformer';

export class PaginatedResponseDTO {
  @Expose()
  count: number;

  @Expose()
  totalPages: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}
