import { IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { InventoryMovementType } from 'common/entities/inventory-movement.entity';

export class CreateInventoryMovementDto {
  @IsUUID()
  inventoryItemId: string;

  @IsEnum(InventoryMovementType)
  type: InventoryMovementType;

  @IsInt()
  @Min(1)
  quantity: number;
}
