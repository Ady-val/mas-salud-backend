import { Expose, Type } from 'class-transformer';
import { InventoryDataDto } from './inventory-data.dto';

export class ResponseInventoryDto {
  @Expose()
  count: number;

  @Expose()
  totalPages: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => InventoryDataDto)
  data: InventoryDataDto[];
}
