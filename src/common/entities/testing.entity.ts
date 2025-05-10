import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('testing')
export class Institution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
