import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Institution } from './institutions.entity';
import { Exclude } from 'class-transformer';

@Entity('medical_specialists')
export class MedicalSpecialist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  speciality: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @ManyToOne(() => Institution, { nullable: false })
  institution: Institution;

  @Column()
  institutionId: string;

  @Exclude()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude()
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deletedAt!: Date | null;
}
