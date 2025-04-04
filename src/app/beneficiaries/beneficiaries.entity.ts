import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('beneficiaries')
export class Beneficiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  secondLastName: string;

  @Column({ type: 'enum', enum: ['Male', 'Female'] })
  gender: 'Male' | 'Female';

  @Column({ length: 18 })
  curp: string;

  @Column({ length: 10 })
  phone: string;

  @Column({ type: 'text' })
  street: string;

  @Column({ type: 'text' })
  externalNumber: string;

  @Column({ type: 'text', nullable: true })
  internalNumber?: string;

  @Column({ type: 'text' })
  colony: string;

  @Column({ length: 5 })
  postalCode: string;

  @Exclude()
  @Column({ default: true })
  active: boolean;

  @Exclude()
  @Column({ unique: true })
  identificationCode: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
  deletedAt!: Date | null;
}
