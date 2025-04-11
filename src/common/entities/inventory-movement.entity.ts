import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { InventoryItem } from './inventory.entity';

export enum InventoryMovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryItemId: string;

  @ManyToOne(() => InventoryItem, { eager: true })
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem;

  @Column({ type: 'enum', enum: InventoryMovementType })
  type: InventoryMovementType;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
