import { Beneficiary } from './beneficiaries.entity';
import { Institution } from './institutions.entity';
import { Product } from './products.entity';
import { SessionEntity } from './sessions.entity';
import { User } from './users.entity';
import { InventoryItem } from './inventory.entity';
import { InventoryMovement } from './inventory-movement.entity';
import { MedicalSpecialist } from './medical-specialist.entity';
import { Ticket } from './tickets.entity';
import { TicketItem } from './ticket-items.entity';

export {
  Beneficiary,
  Institution,
  Product,
  SessionEntity,
  User,
  InventoryItem,
  InventoryMovement,
  MedicalSpecialist,
  Ticket,
  TicketItem,
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
  Ticket,
  TicketItem,
];

export { entities };
