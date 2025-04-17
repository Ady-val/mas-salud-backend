import { Expose, Type } from 'class-transformer';
import { InventoryDataDto } from './inventory-data.dto';
import { PaginatedResponseDTO } from '@common/dto/paginated-response.dto';

export class ResponseInventoryDto extends PaginatedResponseDTO {
  @Expose()
  @Type(() => InventoryDataDto)
  data: InventoryDataDto[];
}
