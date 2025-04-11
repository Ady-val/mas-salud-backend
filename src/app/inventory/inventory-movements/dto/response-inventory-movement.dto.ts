export class ResponseInventoryMovementDto {
  id: string;
  inventoryItemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: Date;
}
