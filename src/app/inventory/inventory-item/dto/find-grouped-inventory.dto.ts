import { Expose, Type } from 'class-transformer';
import { PaginatedResponseDTO } from '@common/dto/paginated-response.dto';
import { GroupedInventory } from './grouped-inventory.dto';

export class GroupedInventoryResponseDto extends PaginatedResponseDTO {
  @Expose()
  @Type(() => GroupedInventory)
  data: GroupedInventory[];
}
