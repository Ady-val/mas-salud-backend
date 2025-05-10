import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Beneficiary } from './beneficiaries.entity';
import { Institution } from './institutions.entity';
import { TicketItem } from './ticket-items.entity';

@Entity('tickets')
@Unique(['ticketNumber'])
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketNumber: string;

  @Column()
  userId: string;

  @Column()
  beneficiaryId: string;

  @Column()
  institutionId: string;

  @ManyToOne(() => Beneficiary, { eager: true })
  @JoinColumn({ name: 'beneficiaryId' })
  beneficiary: Beneficiary;

  @ManyToOne(() => Institution, { eager: true })
  @JoinColumn({ name: 'institutionId' })
  institution: Institution;

  @OneToMany(() => TicketItem, (item) => item.ticket, { cascade: true, eager: true })
  items: TicketItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deletedAt?: Date;
}
