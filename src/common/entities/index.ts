import { Beneficiary } from './beneficiaries.entity';
import { Institution } from './institutions.entity';
import { Product } from './products.entity';
import { SessionEntity } from './sessions.entity';
import { User } from './users.entity';
import { InventoryItem } from './inventory.entity';
import { InventoryMovement } from './inventory-movement.entity';
import { MedicalSpecialist } from './medical-specialist.entity';

export {
  Beneficiary,
  Institution,
  Product,
  SessionEntity,
  User,
  InventoryItem,
  InventoryMovement,
  MedicalSpecialist,
};

const entities = [
  Beneficiary,
  Institution,
  Product,
  SessionEntity,
  User,
  InventoryItem,
  InventoryMovement,
  MedicalSpecialist,
];

export { entities };
