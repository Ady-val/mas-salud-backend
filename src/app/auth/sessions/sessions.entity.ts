import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ type: 'text', unique: true })
  token: string;

  @Column({ default: true })
  isActive: boolean;
}
