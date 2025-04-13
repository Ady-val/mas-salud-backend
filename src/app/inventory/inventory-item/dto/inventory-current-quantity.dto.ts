import { Expose } from 'class-transformer';
import { InventoryItem } from 'common/entities';

export class InventoryItemCurrentCuantity extends InventoryItem {
  @Expose()
  currentQuantity: number;
}
