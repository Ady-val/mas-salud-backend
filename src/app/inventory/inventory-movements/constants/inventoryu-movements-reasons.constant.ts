import { EInventoryMovementReason } from '../enum/inventory-movement-reasons.enum';

export const InventoryMovementReasonLabels = {
  [EInventoryMovementReason.NEW_STOCK_ENTRY]: 'Alta de nuevo lote',
  [EInventoryMovementReason.PRODUCT_DELIVERED]: 'Entrega de producto a cliente',
  [EInventoryMovementReason.BATCH_DELETED_BY_USER]: 'Lote eliminado por el usuario',
};
